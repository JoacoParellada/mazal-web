import { Link, useNavigate } from "react-router-dom";
import { Home, Building2, LogIn, LogOut, User, Menu, X } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import { Button } from "@components/common/Button/Button";
import { useState } from "react";
import styles from "./NavBar.module.css";
import logo from "@/assets/header_mazal.jpg";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img
            src={logo}
            alt="Logo Inmobiliaria"
            className={styles.logoImage}
          />
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <Link to="/" className={styles.navLink}>
            <Home size={18} />
            Inicio
          </Link>
          <Link to="/propiedades" className={styles.navLink}>
            <Building2 size={18} />
            Propiedades
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/admin" className={styles.navLink}>
                <User size={18} />
                Panel Admin
              </Link>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.nombre}</span>
                <span className={styles.userRole}>({user?.rol})</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut size={18} />}
              >
                Salir
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm" icon={<LogIn size={18} />}>
                Ingresar
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.menuButton} onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            to="/"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <Home size={18} />
            Inicio
          </Link>
          <Link
            to="/propiedades"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <Building2 size={18} />
            Propiedades
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={18} />
                Panel Admin
              </Link>
              <div className={styles.mobileUserInfo}>
                <span>{user?.nombre}</span>
                <span className={styles.userRole}>({user?.rol})</span>
              </div>
              <Button
                variant="outline"
                fullWidth
                onClick={handleLogout}
                icon={<LogOut size={18} />}
              >
                Salir
              </Button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="primary" fullWidth icon={<LogIn size={18} />}>
                Ingresar
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
