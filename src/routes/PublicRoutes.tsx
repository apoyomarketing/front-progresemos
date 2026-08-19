import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../api/AuthProvider";

// Evita que alguien con sesión activa vuelva a ver el formulario de login.
export default function PublicRoutes() {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/admin/propuestas" replace />;
  }

  return <Outlet />;
}
