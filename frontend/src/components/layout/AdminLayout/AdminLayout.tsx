import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Plus,
  Home,
  LogOut,
} from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import styles from "./AdminLayout.module.css";
import logo from "@/assets/header_mazal.jpg";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : "";
  };

  const canAccessUsers = user?.rol === "admin" || user?.rol === "supervisor";

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img
              src={logo}
              alt="Logo Inmobiliaria"
              className={styles.logoImage}
            />
          </div>
          <div>
            <h2>Panel Admin</h2>
            <p>{user?.nombre}</p>
            <span className={styles.role}>{user?.rol}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/admin"
            className={`${styles.navLink} ${isActive("/admin")}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/admin/propiedades"
            className={`${styles.navLink} ${isActive("/admin/propiedades")}`}
          >
            <Building2 size={20} />
            Propiedades
          </Link>

          <Link
            to="/admin/propiedades/nueva"
            className={`${styles.navLink} ${isActive(
              "/admin/propiedades/nueva"
            )}`}
          >
            <Plus size={20} />
            Nueva Propiedad
          </Link>

          {canAccessUsers && (
            <Link
              to="/admin/usuarios"
              className={`${styles.navLink} ${isActive("/admin/usuarios")}`}
            >
              <Users size={20} />
              Usuarios
            </Link>
          )}

          <hr className={styles.divider} />

          <Link to="/" className={styles.navLink}>
            <Home size={20} />
            Ir al Sitio
          </Link>

          <button
            onClick={logout}
            className={`${styles.navLink} ${styles.logoutButton}`}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};
