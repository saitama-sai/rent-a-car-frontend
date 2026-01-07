import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Button, Modal, ModalHeader, ModalBody, Label, TextInput } from "flowbite-react";
import type { Rental } from "../../../types";
import { rentalService } from "../../../services/rentalService";

export function RentalList() {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingRental, setEditingRental] = useState<Rental | null>(null);
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        totalPrice: ""
    });

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

    const handleOpenEdit = (rental: Rental) => {
        setEditingRental(rental);
        setFormData({
            startDate: new Date(rental.startDate).toISOString().split('T')[0],
            endDate: new Date(rental.endDate).toISOString().split('T')[0],
            totalPrice: rental.totalPrice.toString()
        });
        setOpenModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bu kiralama kaydını silmek istediğinize emin misiniz?")) {
            try {
                await rentalService.delete(id);
                setRentals(rentals.filter(r => r.id !== id));
                alert("Kiralama başarıyla silindi.");
            } catch (error) {
                console.error("Silme hatası:", error);
                alert("Silme işlemi sırasında bir hata oluştu.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRental) {
            try {
                await rentalService.update(editingRental.id, {
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    totalPrice: Number(formData.totalPrice)
                });
                alert("Kiralama başarıyla güncellendi!");
                loadRentals();
                setOpenModal(false);
            } catch (error) {
                console.error("Güncelleme hatası:", error);
                alert("Güncelleme sırasında bir hata oluştu.");
            }
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
                        <TableHeadCell>İşlemler</TableHeadCell>
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
                                <TableCell className="flex gap-2">
                                    <Button size="xs" color="warning" onClick={() => handleOpenEdit(rental)}>Düzenle</Button>
                                    <Button size="xs" color="failure" onClick={() => handleDelete(rental.id)}>Sil</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {rentals.length === 0 && <p className="text-center p-4">Henüz kiralama kaydı yok.</p>}
            </div>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader>Kiralamayı Düzenle</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block"><Label htmlFor="startDate">Başlangıç Tarihi</Label></div>
                            <TextInput id="startDate" type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                        </div>
                        <div>
                            <div className="mb-2 block"><Label htmlFor="endDate">Bitiş Tarihi</Label></div>
                            <TextInput id="endDate" type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                        </div>
                        <div>
                            <div className="mb-2 block"><Label htmlFor="totalPrice">Toplam Fiyat</Label></div>
                            <TextInput id="totalPrice" type="number" required value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })} />
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
