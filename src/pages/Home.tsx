import { useState, useEffect } from "react";
import { Card, Button, Badge, Label, TextInput } from "flowbite-react";
import type { Car } from "../types";
import { carService } from "../services/carService";
import { rentalService } from "../services/rentalService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Home() {
    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        const data = await carService.getAll();
        setCars(data);
    };

    const handleRentClick = (car: Car) => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setSelectedCar(car);
        setShowModal(true);
    };

    const handleRentSubmit = async () => {
        if (!selectedCar || !startDate || !endDate) return;

        if (!user || !user.id) {
            alert("Oturum hatası: Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
            return;
        }

        try {
            await rentalService.rent(user.id, selectedCar.id, startDate, endDate);
            alert("Kiralama işlemi başarılı!");
            setShowModal(false);
            loadCars(); // Listeyi yenile (Araba durumu değişmiş olabilir)
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || error.message;
            alert("Kiralama başarısız: " + message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="text-center my-10">
                <h1 className="text-4xl font-bold mb-4">Hoş Geldiniz</h1>
                <p className="text-gray-600">Hayalinizdeki aracı hemen kiralayın.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                    <Card
                        key={car.id}
                        imgAlt={car.model}
                        imgSrc={car.imageUrl || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop"}
                    >
                        {/* We can't easily add onError to flowbite Card's internal img via props, 
                            so we'll use a custom render if needed, but for now let's use a more reliable default.
                            Actually, flowbite Card renders an img. We might need to override it or use a div bg.
                            Let's keep it simple and use a high-quality default sedan. */}
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {car.brand?.name} {car.model}
                            </h5>
                            <Badge color={car.available ? "green" : "red"}>
                                {car.available ? "Müsait" : "Kirada"}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {car.features?.map(f => (
                                <Badge key={f.id} color="gray">{f.name}</Badge>
                            ))}
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{car.dailyPrice} TL<span className="text-sm font-normal text-gray-500">/gün</span></span>
                            <Button
                                onClick={() => handleRentClick(car)}
                                color="blue"
                                disabled={!car.available}
                            >
                                {car.available ? "Kirala" : "Kiralanmış"}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Custom Modal */}
            {showModal && (
                <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 p-4 md:inset-0 h-modal md:h-full">
                    <div className="relative w-full h-full max-w-md md:h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                    Araç Kirala: {selectedCar?.brand?.name} {selectedCar?.model}
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => setShowModal(false)}
                                >
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Kapat</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <Label htmlFor="start">Başlangıç Tarihi</Label>
                                    <TextInput
                                        id="start"
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="end">Bitiş Tarihi</Label>
                                    <TextInput
                                        id="end"
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <Button onClick={handleRentSubmit}>Kiralamayı Onayla</Button>
                                <Button color="gray" onClick={() => setShowModal(false)}>
                                    İptal
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
