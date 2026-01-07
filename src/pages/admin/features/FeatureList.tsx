import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Modal, ModalHeader, ModalBody, Label, TextInput } from "flowbite-react";
import type { Feature } from "../../../types";
import { featureService } from "../../../services/featureService";

export function FeatureList() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
    const [formData, setFormData] = useState({ name: "" });

    useEffect(() => {
        loadFeatures();
    }, []);

    const loadFeatures = async () => {
        const data = await featureService.getAll();
        setFeatures(data);
    };

    const handleOpenCreate = () => {
        setEditingFeature(null);
        setFormData({ name: "" });
        setOpenModal(true);
    };

    const handleOpenEdit = (feature: Feature) => {
        setEditingFeature(feature);
        setFormData({ name: feature.name });
        setOpenModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bu özelliği silmek istediğinize emin misiniz?")) {
            try {
                await featureService.delete(id);
                loadFeatures();
                setFeatures(features.filter(f => f.id !== id));
                alert("Özellik başarıyla silindi.");
            } catch (error: any) {
                console.error("Silme hatası:", error);
                alert("Silme işlemi başarısız: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingFeature) {
                await featureService.update(editingFeature.id, formData.name);
                setFeatures(features.map(f => f.id === editingFeature.id ? { ...f, name: formData.name } : f));
                alert("Özellik başarıyla güncellendi!");
            } else {
                const newFeature = await featureService.create(formData.name);
                setFeatures([...features, newFeature as Feature]);
                alert("Yeni özellik eklendi!");
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
                <h1 className="text-2xl font-bold">Özellik Yönetimi (Common Features)</h1>
                <Button color="green" onClick={handleOpenCreate}>Yeni Özellik Ekle</Button>
            </div>

            <div className="overflow-x-auto">
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>ID</TableHeadCell>
                        <TableHeadCell>Özellik Adı</TableHeadCell>
                        <TableHeadCell>İşlemler</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {features.map((feature) => (
                            <TableRow key={feature.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell>{feature.id}</TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {feature.name}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="xs" color="warning" onClick={() => handleOpenEdit(feature)}>
                                        Düzenle
                                    </Button>
                                    <Button size="xs" color="failure" onClick={() => handleDelete(feature.id)}>
                                        Sil
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader>{editingFeature ? "Özelliği Düzenle" : "Yeni Özellik Ekle"}</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Özellik Adı</Label>
                            </div>
                            <TextInput
                                id="name"
                                placeholder="Örn: Sunroof"
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
