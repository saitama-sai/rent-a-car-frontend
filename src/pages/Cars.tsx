import { useState, useEffect } from "react";
import { Card, Badge } from "flowbite-react";
import type { Car } from "../types";
import { carService } from "../services/carService";

export function Cars() {
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        const data = await carService.getAll();
        setCars(data);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Araç Filomuz</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                    <Card
                        key={car.id}
                        className="max-w-sm"
                    >
                        <img
                            src={car.imageUrl || "https://placehold.co/600x400"}
                            alt={car.model}
                            className="w-full h-48 object-cover rounded-t-lg"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
                            }}
                        />
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
                            {/* Detay sayfası veya modal eklenebilir */}
                        </div>
                    </Card>
                ))}
            </div>

            {cars.length === 0 && (
                <p className="text-center text-gray-500 mt-10">Henüz kayıtlı araç bulunmamaktadır.</p>
            )}
        </div>
    );
}
