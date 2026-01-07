import { useState } from "react";
import { Button, Card, Label, TextInput, Alert, Select } from "flowbite-react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

export function Register() {
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: string;
        profilePicture?: File;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "customer"
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = new FormData();
            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("role", formData.role);
            if (formData.profilePicture) {
                data.append("file", formData.profilePicture);
            }

            await authService.register(data);
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
            navigate("/login");
        } catch (err: any) {
            console.error(err);
            setError("Kayıt başarısız: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
            <Card className="max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-900">Kayıt Ol</h2>
                {error && <Alert color="failure">{error}</Alert>}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-4">
                        <div className="flex flex-col items-center">
                            <Label htmlFor="profile-upload" className="mb-2 cursor-pointer">
                                {formData.profilePicture ? (
                                    <img
                                        src={URL.createObjectURL(formData.profilePicture)}
                                        alt="Profil Önizleme"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                                        <span className="text-3xl">?</span>
                                    </div>
                                )}
                            </Label>
                            <Label htmlFor="profile-upload" className="cursor-pointer text-blue-600 hover:underline text-sm">
                                Profil Resmi Ekle
                            </Label>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setFormData({ ...formData, profilePicture: e.target.files[0] });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="firstName">Adınız</Label>
                            </div>
                            <TextInput
                                id="firstName"
                                name="firstName"
                                placeholder="Ahmet"
                                required
                                autoComplete="given-name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="lastName">Soyadınız</Label>
                            </div>
                            <TextInput
                                id="lastName"
                                name="lastName"
                                placeholder="Yılmaz"
                                required
                                autoComplete="family-name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email">Email Adresiniz</Label>
                        </div>
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ahmet@ornek.com"
                            required
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password">Şifreniz</Label>
                        </div>
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="role">Rol Seçiniz (Demo)</Label>
                        </div>
                        <Select id="role" required value={formData.role} onChange={handleChange}>
                            <option value="customer">Müşteri (User)</option>
                            <option value="admin">Yönetici (Admin)</option>
                        </Select>
                    </div>

                    <Button type="submit" color="green">Kayıt Ol</Button>

                    <div className="text-sm text-center mt-2">
                        Zaten hesabınız var mı? <Link to="/login" className="text-blue-600 hover:underline">Giriş Yap</Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
