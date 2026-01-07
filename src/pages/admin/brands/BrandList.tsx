import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Modal, ModalHeader, ModalBody, Label, TextInput } from "flowbite-react";
import type { Brand } from "../../../types";
import { brandService } from "../../../services/brandService";

export function BrandList() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [formData, setFormData] = useState({ name: "" });

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        const data = await brandService.getAll();
        setBrands(data);
    };

    const handleOpenCreate = () => {
        setEditingBrand(null);
        setFormData({ name: "" });
        setOpenModal(true);
    };

    const handleOpenEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({ name: brand.name });
        setOpenModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bu markayı silmek istediğinize emin misiniz?")) {
            try {
                await brandService.delete(id);
                loadBrands();
                setBrands(brands.filter(b => b.id !== id));
                alert("Marka başarıyla silindi.");
            } catch (error: any) {
                console.error("Silme hatası:", error);
                alert("Silme işlemi başarısız: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBrand) {
                await brandService.update(editingBrand.id, formData.name);
                setBrands(brands.map(b => b.id === editingBrand.id ? { ...b, name: formData.name } : b));
                alert("Marka başarıyla güncellendi!");
            } else {
                const newBrand = await brandService.create(formData.name);
                setBrands([...brands, newBrand as Brand]);
                alert("Yeni marka eklendi!");
            }
            setOpenModal(false);
        } catch (error: any) {
            console.error("Kayıt hatası:", error);
            alert("İşlem başarısız: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Marka Yönetimi</h1>
                <Button color="green" onClick={handleOpenCreate}>Yeni Marka Ekle</Button>
            </div>

            <div className="overflow-x-auto">
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>ID</TableHeadCell>
                        <TableHeadCell>Marka Adı</TableHeadCell>
                        <TableHeadCell>İşlemler</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {brands.map((brand) => (
                            <TableRow key={brand.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell>{brand.id}</TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {brand.name}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="xs" color="warning" onClick={() => handleOpenEdit(brand)}>
                                        Düzenle
                                    </Button>
                                    <Button size="xs" color="failure" onClick={() => handleDelete(brand.id)}>
                                        Sil
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader>{editingBrand ? "Markayı Düzenle" : "Yeni Marka Ekle"}</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Marka Adı</Label>
                            </div>
                            <TextInput
                                id="name"
                                placeholder="Örn: BMW"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
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
