import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { Loader } from "@components/common/Loader/Loader";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  roles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles si están especificados
  if (roles && user && !roles.includes(user.rol)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
