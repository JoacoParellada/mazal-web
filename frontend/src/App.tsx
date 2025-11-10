import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public pages
import PropertiesPage from "./pages/public/PropertiesPage/PropertiesPage";
import HomePage from "./pages/public/HomePage/HomePage";
import PropertyDetailPage from "./pages/public/PropertyDetails/PropertyDetailPage";

// Auth pages
import { PrivateRoute } from "./components/auth/PrivateRoute/PrivateRoute";
import LoginPage from "./components/auth/LoginPage/LoginPage";

// Admin pages
import DashboardPage from "./pages/admin/DashboardPage/DashboardPage";
import PropertiesAdminPage from "./pages/admin/PropertiesAdminPage/PropertiesAdminPage";
import CreatePropertyPage from "./pages/admin/CreatePropertyPage/CreatePropertyPage";
import UsersPage from "./pages/admin/UsersPage/UsersPage";

// Components

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/propiedades" element={<PropertiesPage />} />
        <Route path="/propiedades/:id" element={<PropertyDetailPage />} />

        {/* Rutas de autenticación */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas privadas (admin) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/propiedades"
          element={
            <PrivateRoute>
              <PropertiesAdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/propiedades/nueva"
          element={
            <PrivateRoute>
              <CreatePropertyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/propiedades/editar/:id"
          element={
            <PrivateRoute>
              <CreatePropertyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <PrivateRoute roles={["admin", "supervisor"]}>
              <UsersPage />
            </PrivateRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
