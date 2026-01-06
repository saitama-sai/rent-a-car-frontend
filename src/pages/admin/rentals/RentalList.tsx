import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge } from "flowbite-react";
import type { Rental } from "../../../types";
import { rentalService } from "../../../services/rentalService";

export function RentalList() {
    const [rentals, setRentals] = useState<Rental[]>([]);

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = async () => {
        try {
            const data = await rentalService.getAll();
            setRentals(data);
        } catch (error) {
            console.error("Failed to load rentals", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Kiralama Geçmişi</h1>
            <div className="overflow-x-auto">
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>Kiralayan</TableHeadCell>
                        <TableHeadCell>Araç</TableHeadCell>
                        <TableHeadCell>Tarihler</TableHeadCell>
                        <TableHeadCell>Ücret</TableHeadCell>
                        <TableHeadCell>Durum</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {rentals.map((rental) => (
                            <TableRow key={rental.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {rental.user?.email || "Bilinmiyor"}
                                </TableCell>
                                <TableCell>
                                    {rental.car?.brand?.name} {rental.car?.model} <br />
                                    <span className="text-xs text-gray-500">{rental.car?.plate}</span>
                                </TableCell>
                                <TableCell>
                                    {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {rental.totalPrice} TL
                                </TableCell>
                                <TableCell>
                                    <Badge color="green">Aktif</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {rentals.length === 0 && <p className="text-center p-4">Henüz kiralama kaydı yok.</p>}
            </div>
        </div>
    );
}
