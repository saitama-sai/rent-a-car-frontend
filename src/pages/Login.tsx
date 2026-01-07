import { useState } from "react";
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export function Login() {
  const [email, setEmail] = useState("");
  const [_password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login({ email, password: _password });
      login(response.token, response.user);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError("Giriş başarısız. " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-900">Giriş Yap</h2>
        {error && <Alert color="failure">{error}</Alert>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Email Adresiniz</Label>
            </div>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="admin@rentacar.com"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="current-password"
              value={_password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" color="blue">Giriş Yap</Button>
        </form>
      </Card>
    </div>
  );
}
