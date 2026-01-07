import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { authService } from "../services/authService";

export function Profile() {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const IMAGE_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://rent-a-car-backend-6pfm.onrender.com';

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || ""
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user) return;

            // Boş şifreyi gönderme (mevcut şifreyi bozmamak için)
            const payload: any = { ...formData };
            if (!payload.password || payload.password.trim() === '') {
                delete payload.password;
            }

            const updatedUser = await authService.updateProfile(user.id, payload);
            updateUser(updatedUser); // Context ve LocalStorage güncelle
            alert("Profil güncellendi!");

            // Şifre alanını temizle (başarılı güncelleme sonrası)
            setFormData(prev => ({ ...prev, password: "" }));
        } catch (error: any) {
            alert("Hata: " + error.message);
        }
    };

    return (
        <div className="flex justify-center items-center p-6">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center">Profil Bilgileri</h2>

                <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-200 flex items-center justify-center">
                        {user?.profilePictureUrl ? (
                            <img
                                src={`${IMAGE_BASE_URL}${user.profilePictureUrl}`}
                                alt="Profil"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl text-gray-500">
                                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "?"}
                            </span>
                        )}
                    </div>
                    <Label
                        htmlFor="profile-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Fotoğrafı Değiştir
                    </Label>
                    <input
                        id="profile-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                            if (e.target.files && e.target.files[0] && user) {
                                try {
                                    const file = e.target.files[0];
                                    const { url } = await authService.uploadProfilePicture(user.id, file);
                                    // Update context - this might be tricky if updateUser expects full user object
                                    // Ideally updateUser should merge. Checking context... 
                                    // Assuming updateUser(updatedUser) works if we pass full object.
                                    // But here we only get URL back. 
                                    // We should manually update the local user object for now or re-fetch me if possible.
                                    // Let's assume shallow merge functionality or we manually construct it.
                                    const updatedUserWithPic = { ...user, profilePictureUrl: url };
                                    updateUser(updatedUserWithPic);
                                    alert("Profil resmi güncellendi!");
                                } catch (error: any) {
                                    alert("Resim yüklenirken hata: " + error.message);
                                }
                            }
                        }}
                    />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <div className="mb-2 block"><Label htmlFor="firstName">Ad</Label></div>
                        <TextInput id="firstName" autoComplete="given-name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div>
                        <div className="mb-2 block"><Label htmlFor="lastName">Soyad</Label></div>
                        <TextInput id="lastName" autoComplete="family-name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                    <div>
                        <div className="mb-2 block"><Label htmlFor="email">Email</Label></div>
                        <TextInput id="email" autoComplete="email" value={formData.email} disabled />
                    </div>
                    <div>
                        <div className="mb-2 block"><Label htmlFor="password">Yeni Şifre (İsteğe bağlı)</Label></div>
                        <TextInput id="password" type="password" autoComplete="new-password" placeholder="Değiştirmek istemiyorsanız boş bırakın" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <Button type="submit" color="blue">Güncelle</Button>
                </form>
            </Card>
        </div>
    );
}
