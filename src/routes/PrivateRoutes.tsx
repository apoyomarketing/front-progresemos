import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../api/AuthProvider";
import { adminRoutes } from ".";

// No hay endpoint de verificación de sesión contra el backend confirmado en esta app,
// así que la validez de la sesión se apoya en useAuthSession (expira localmente por
// accessExpiresAt), igual que ya hacía el flujo de login antes de esta reestructuración.
export default function PrivateRoutes() {
  const { session } = useAuth();
  const { pathname } = useLocation();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const currentPath = pathname.replace(/^\/admin\/?/, "");
  const matchedRoute = adminRoutes.find((route) => route.path === currentPath);
  const isAllowed =
    !matchedRoute ||
    matchedRoute.roles.length === 0 ||
    matchedRoute.roles.includes(session.usuario.rol?.nombre ?? "");

  if (!isAllowed) {
    return <Navigate to="/admin/propuestas" replace />;
  }

  return <Outlet />;
}
