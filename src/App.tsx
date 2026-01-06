import { Routes, Route } from "react-router-dom";
import { AppNavbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/admin/Dashboard";
import { BrandList } from "./pages/admin/brands/BrandList";
import { FeatureList } from "./pages/admin/features/FeatureList";
import { CarList } from "./pages/admin/cars/CarList";
import { RentalList } from "./pages/admin/rentals/RentalList";
import { Home } from "./pages/Home";
import { Cars } from "./pages/Cars";
import { About } from "./pages/About";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />

      {/* Sayfaların Değişeceği Alan */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/about" element={<About />} />

        {/* Protected Customer/Admin Route */}
        <Route element={<ProtectedRoute roles={['customer', 'admin']} />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes (Örnek) */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/brands" element={<BrandList />} />
          <Route path="/admin/features" element={<FeatureList />} />
          <Route path="/admin/cars" element={<CarList />} />
          <Route path="/admin/rentals" element={<RentalList />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;