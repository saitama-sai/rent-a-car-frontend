import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { carService } from "../../services/carService";
import { brandService } from "../../services/brandService";
import { featureService } from "../../services/featureService";
import { rentalService } from "../../services/rentalService";

export function Dashboard() {
    const [stats, setStats] = useState({
        cars: 0,
        brands: 0,
        features: 0,
        rentals: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const [cars, brands, features, rentals] = await Promise.all([
            carService.getAll(),
            brandService.getAll(),
            featureService.getAll(),
            rentalService.getAll()
        ]);

        setStats({
            cars: cars.length,
            brands: brands.length,
            features: features.length,
            rentals: rentals.length
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Yönetim Paneli</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/brands">
                    <Card className="hover:bg-gray-50 cursor-pointer h-full">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Markalar <span className="text-blue-600 text-3xl float-right">{stats.brands}</span>
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Araç markalarını yönetin.
                        </p>
                    </Card>
                </Link>
                <Link to="/admin/cars">
                    <Card className="hover:bg-gray-50 cursor-pointer h-full">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Arabalar <span className="text-blue-600 text-3xl float-right">{stats.cars}</span>
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Araç kiralama listesini yönetin.
                        </p>
                    </Card>
                </Link>
                <Link to="/admin/features">
                    <Card className="hover:bg-gray-50 cursor-pointer h-full">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Özellikler <span className="text-blue-600 text-3xl float-right">{stats.features}</span>
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Araç özelliklerini tanımlayın.
                        </p>
                    </Card>
                </Link>
                <Link to="/admin/rentals">
                    <Card className="hover:bg-gray-50 cursor-pointer h-full">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Kiralamalar <span className="text-green-600 text-3xl float-right">{stats.rentals}</span>
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Aktif ve geçmiş kiralamalar.
                        </p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
