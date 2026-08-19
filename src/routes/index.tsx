import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FileText, Newspaper, Megaphone, Users, type LucideIcon } from "lucide-react";
import App from "../App";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import ScrollToTop from "./ScrollToTop";

// El landing ("/") se importa eager porque es la ruta crítica de SEO/primer pintado.
// Todo lo demás se carga solo cuando el usuario navega a esa ruta.
const AllProposals = lazy(() => import("../AllProposals"));
const Login = lazy(() => import("../Login"));
const Admin = lazy(() => import("../cms/Admin"));
const PropuestasPage = lazy(() => import("../cms/pages/PropuestasPage"));
const NoticiasPage = lazy(() => import("../cms/pages/NoticiasPage"));
const ComunicadosPage = lazy(() => import("../cms/pages/ComunicadosPage"));
const UsuariosPage = lazy(() => import("../cms/pages/UsuariosPage"));

export interface AdminRoute {
  path: string;
  label: string;
  icon: LucideIcon;
  // Roles permitidos para esta ruta ("nombre" del rol, tal como lo devuelve la API).
  // Un array vacío significa "cualquier usuario autenticado".
  roles: string[];
  element: ReactNode;
}

export const adminRoutes: AdminRoute[] = [
  { path: "propuestas", label: "Propuestas", icon: FileText, roles: [], element: <PropuestasPage /> },
  { path: "noticias", label: "Noticias", icon: Newspaper, roles: [], element: <NoticiasPage /> },
  { path: "comunicados", label: "Comunicados", icon: Megaphone, roles: [], element: <ComunicadosPage /> },
  { path: "usuarios", label: "Usuarios", icon: Users, roles: ["Administrador"], element: <UsuariosPage /> },
];

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/propuestas" element={<AllProposals />} />

          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoutes />}>
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Navigate to="propuestas" replace />} />
              {adminRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
