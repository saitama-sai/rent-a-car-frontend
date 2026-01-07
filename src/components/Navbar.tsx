
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Dropdown, Avatar, DropdownHeader, DropdownItem, DropdownDivider } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AppNavbar() {
  const path = useLocation().pathname;
  const { user, isAuthenticated, logout } = useAuth();

  // Profile resimlerinin prefix'i (localhost veya render)
  const IMAGE_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://rent-a-car-backend-6pfm.onrender.com';

  return (
    <Navbar fluid rounded border>
      <NavbarBrand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Rent A Car
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        {isAuthenticated ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={user?.profilePictureUrl ? `${IMAGE_BASE_URL}${user.profilePictureUrl}` : undefined}
                rounded
                placeholderInitials={user?.firstName?.charAt(0) || user?.email?.charAt(0) || "?"}
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user?.firstName} {user?.lastName}</span>
              <span className="block truncate text-sm font-medium">{user?.email}</span>
            </DropdownHeader>
            <DropdownItem as={Link} to="/profile">Profil</DropdownItem>
            {user?.role === 'admin' && (
              <>
                <DropdownItem as={Link} to="/admin/dashboard">Yönetim Paneli</DropdownItem>
                <DropdownItem as={Link} to="/admin/cars">Araç Yönetimi</DropdownItem>
              </>
            )}
            <DropdownDivider />
            <DropdownItem onClick={logout}>Çıkış Yap</DropdownItem>
          </Dropdown>
        ) : (
          <div className="flex gap-2">
            <Button as={Link} to="/login" color="blue" size="sm">
              Giriş Yap
            </Button>
            <Button as={Link} to="/register" color="gray" size="sm">
              Kayıt Ol
            </Button>
          </div>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="/" active={path === "/"}>
          Ana Sayfa
        </NavbarLink>
        <NavbarLink href="/cars" active={path === "/cars"}>
          Arabalar
        </NavbarLink>
        <NavbarLink href="/about" active={path === "/about"}>
          Hakkımızda
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}