import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Modal, ModalHeader, ModalBody, Label, TextInput, Select, Checkbox } from "flowbite-react";
import type { Car, Brand, Feature } from "../../../types";
import { carService } from "../../../services/carService";
import { brandService } from "../../../services/brandService";
import { featureService } from "../../../services/featureService";

const PREDEFINED_CAR_IMAGES = {
    // BMW
    "BMW iX (Electric)": "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?q=80&w=800&auto=format&fit=crop",
    "BMW 5 Series (Sedan)": "https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=800&auto=format&fit=crop",
    "BMW M4 (Sport)": "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=800&auto=format&fit=crop",

    // Mercedes
    "Mercedes C-Class": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
    "Mercedes EQS (Electric)": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop",
    "Mercedes G-Wagon (SUV)": "https://images.unsplash.com/photo-1520031444821-d1c1639c9c71?q=80&w=800&auto=format&fit=crop",

    // Audi
    "Audi A6 (Sedan)": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800&auto=format&fit=crop",
    "Audi e-tron (Electric)": "https://images.unsplash.com/photo-1617430635293-f3633d99e28f?q=80&w=800&auto=format&fit=crop",
    "Audi R8 (Sport)": "https://images.unsplash.com/photo-1603553329474-99f95f35394f?q=80&w=800&auto=format&fit=crop",

    // Tesla
    "Tesla Model S": "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop",
    "Tesla Model Y": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",

    // Toyota & Fiat
    "Toyota Corolla": "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=800&auto=format&fit=crop",
    "Toyota Camry": "https://images.unsplash.com/photo-1593022532454-f586940026e9?q=80&w=800&auto=format&fit=crop",
    "Fiat 500 (Small)": "https://images.unsplash.com/photo-1527247043589-98e6ac08f56c?q=80&w=800&auto=format&fit=crop",

    // Generic
    "Modern SUV (Generic)": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    "Modern Sedan (Generic)": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop"
};

export function CarList() {
    const [cars, setCars] = useState<Car[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);

    const [openModal, setOpenModal] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);

    // Basit form state
    const [formData, setFormData] = useState({
        brandId: "",
        model: "",
        year: "",
        color: "",
        plate: "",
        dailyPrice: "",
        imageUrl: "",
        featureIds: [] as string[]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const carsData = await carService.getAll();
        setCars(carsData);
        const brandsData = await brandService.getAll();
        setBrands(brandsData);
        const featuresData = await featureService.getAll();
        setFeatures(featuresData);
    };

    const handleOpenCreate = () => {
        setEditingCar(null);
        setFormData({ brandId: "", model: "", year: "", color: "", plate: "", dailyPrice: "", imageUrl: "", featureIds: [] });
        setOpenModal(true);
    };

    const handleOpenEdit = (car: Car) => {
        setEditingCar(car);
        setFormData({
            brandId: car.brand?.id.toString() || car.brandId?.toString() || "",
            model: car.model,
            year: car.year?.toString() || "",
            color: car.color || "",
            plate: car.plate,
            dailyPrice: car.dailyPrice.toString(),
            imageUrl: car.imageUrl || "",
            featureIds: car.features && Array.isArray(car.features)
                ? car.features.map(f => f.id.toString())
                : []
        });
        setOpenModal(true);
    };

    const handleFeatureChange = (featureId: string, checked: boolean) => {
        if (checked) {
            setFormData({ ...formData, featureIds: [...formData.featureIds, featureId] });
        } else {
            setFormData({ ...formData, featureIds: formData.featureIds.filter(id => id !== featureId) });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.brandId || Number(formData.brandId) <= 0) {
            alert("Lütfen geçerli bir Marka seçiniz.");
            return;
        }
        if (!formData.year || Number(formData.year) < 1900 || Number(formData.year) > new Date().getFullYear() + 1) {
            alert("Lütfen geçerli bir Yıl giriniz.");
            return;
        }
        if (!formData.dailyPrice || Number(formData.dailyPrice) <= 0) {
            alert("Lütfen geçerli bir Fiyat giriniz.");
            return;
        }

        try {
            const carData = {
                brand: { id: Number(formData.brandId) }, // TypeORM relation mapping
                model: formData.model,
                year: Number(formData.year),
                color: formData.color,
                plate: formData.plate,
                dailyPrice: Number(formData.dailyPrice),
                imageUrl: formData.imageUrl,
                // Backend features: [{ id: 1 }, { id: 2 }] formatında bekliyor
                features: formData.featureIds.map(id => ({ id: Number(id) }))
            };

            if (editingCar) {
                await carService.update(editingCar.id, carData as any);
                alert("Araç başarıyla güncellendi!");
            } else {
                await carService.create(carData as any);
                alert("Yeni araç başarıyla eklendi!");
            }
            loadData();
            setOpenModal(false);
        } catch (error: any) {
            console.error("Kayıt hatası:", error);
            alert("İşlem sırasında bir hata oluştu: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bu aracı silmek istediğinize emin misiniz?")) {
            await carService.delete(id);
            loadData();
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Araç Yönetimi</h1>
                <Button color="green" onClick={handleOpenCreate}>Yeni Araç Ekle</Button>
            </div>

            <div className="overflow-x-auto">
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>Resim</TableHeadCell>
                        <TableHeadCell>Marka/Model</TableHeadCell>
                        <TableHeadCell>Plaka</TableHeadCell>
                        <TableHeadCell>Fiyat</TableHeadCell>
                        <TableHeadCell>Özellikler</TableHeadCell>
                        <TableHeadCell>İşlemler</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {cars.map((car) => (
                            <TableRow key={car.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell>
                                    <img
                                        src={car.imageUrl}
                                        alt={car.model}
                                        className="w-16 h-10 object-cover rounded"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/100x60?text=No+Image";
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {car.brand?.name} {car.model}
                                </TableCell>
                                <TableCell>{car.plate}</TableCell>
                                <TableCell>{car.dailyPrice} TL</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {car.features?.map(f => (
                                            <span key={f.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                {f.name}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="xs" color="warning" onClick={() => handleOpenEdit(car)}>Düzenle</Button>
                                    <Button size="xs" color="failure" onClick={() => handleDelete(car.id)}>Sil</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
                <ModalHeader>{editingCar ? "Aracı Düzenle" : "Yeni Araç Ekle"}</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="mb-2 block"><Label htmlFor="brand">Marka</Label></div>
                                <Select id="brand" required value={formData.brandId} onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}>
                                    <option value="">Seçiniz</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <div className="mb-2 block"><Label htmlFor="model">Model</Label></div>
                                <TextInput id="model" required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="mb-2 block"><Label htmlFor="year">Yıl</Label></div>
                                <TextInput id="year" type="number" required value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                            </div>
                            <div>
                                <div className="mb-2 block"><Label htmlFor="color">Renk</Label></div>
                                <TextInput id="color" required value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="mb-2 block"><Label htmlFor="plate">Plaka</Label></div>
                                <TextInput id="plate" required value={formData.plate} onChange={(e) => setFormData({ ...formData, plate: e.target.value })} />
                            </div>
                            <div>
                                <div className="mb-2 block"><Label htmlFor="price">Günlük Fiyat</Label></div>
                                <TextInput id="price" type="number" required value={formData.dailyPrice} onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 block"><Label>Örnek Resim Seç (veya URL girin)</Label></div>
                            <Select id="imageSelect" onChange={(e) => {
                                const val = e.target.value;
                                if (val) setFormData({ ...formData, imageUrl: val });
                            }}>
                                <option value="">Resim Seçiniz...</option>
                                {Object.entries(PREDEFINED_CAR_IMAGES).map(([name, url]) => (
                                    <option key={name} value={url}>{name}</option>
                                ))}
                            </Select>
                            <div className="mt-2 block"><Label htmlFor="image">Resim URL</Label></div>
                            <TextInput id="image" required value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                            {formData.imageUrl && (
                                <div className="mt-2 text-center">
                                    <Label>Önizleme:</Label>
                                    <img
                                        src={formData.imageUrl}
                                        alt="Önizleme"
                                        className="h-32 mx-auto object-cover rounded border"
                                        onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/100x60?text=Kirik+Link"}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block"><Label>Özellikler</Label></div>
                            <div className="flex flex-wrap gap-4 p-4 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                                {features.map(f => (
                                    <div key={f.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`feat-${f.id}`}
                                            checked={formData.featureIds.includes(f.id.toString())}
                                            onChange={(e) => handleFeatureChange(f.id.toString(), e.target.checked)}
                                        />
                                        <Label htmlFor={`feat-${f.id}`} className="text-gray-900 dark:text-gray-300 cursor-pointer">{f.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button color="gray" onClick={() => setOpenModal(false)}>İptal</Button>
                            <Button type="submit" color="blue">Kaydet</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
}
