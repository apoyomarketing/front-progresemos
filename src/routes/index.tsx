import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FileText, Newspaper, Megaphone, Users, IdCard, CalendarCheck, type LucideIcon } from "lucide-react";
import App from "../App";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import ScrollToTop from "./ScrollToTop";

// El landing ("/") se importa eager porque es la ruta crítica de SEO/primer pintado.
// Todo lo demás se carga solo cuando el usuario navega a esa ruta.
const AllProposals = lazy(() => import("../AllProposals"));
const AllNews = lazy(() => import("../AllNews"));
const Affiliation = lazy(() => import("../Affiliation"));
const GamesPage = lazy(() => import("../GamesPage"));
const GalleryPage = lazy(() => import("../GalleryPage"));
const Login = lazy(() => import("../Login"));
const Admin = lazy(() => import("../cms/Admin"));
const PropuestasPage = lazy(() => import("../cms/pages/PropuestasPage"));
const NoticiasPage = lazy(() => import("../cms/pages/NoticiasPage"));
const ComunicadosPage = lazy(() => import("../cms/pages/ComunicadosPage"));
const UsuariosPage = lazy(() => import("../cms/pages/UsuariosPage"));
const AfiliadosPage = lazy(() => import("../cms/pages/AfiliadosPage"));
const ActividadesPage = lazy(() => import("../cms/pages/ActividadesPage"));
const LlamarAsistenciaPage = lazy(() => import("../cms/pages/LlamarAsistenciaPage"));

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
  {
    path: "afiliados",
    label: "Afiliados",
    icon: IdCard,
    roles: ["Administrador", "Editor", "Coordinador"],
    element: <AfiliadosPage />,
  },
  {
    path: "actividades",
    label: "Actividades",
    icon: CalendarCheck,
    roles: ["Administrador", "Editor", "Coordinador"],
    element: <ActividadesPage />,
  },
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
          <Route path="/noticias" element={<AllNews />} />
          <Route path="/afiliacion" element={<Affiliation />} />
          <Route path="/juegos" element={<GamesPage />} />
          <Route path="/galeria" element={<GalleryPage />} />

          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoutes />}>
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Navigate to="propuestas" replace />} />
              {adminRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              <Route path="actividades/:actividadId/asistencia" element={<LlamarAsistenciaPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
