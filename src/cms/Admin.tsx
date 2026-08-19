import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import logo from "../assets/progresemos-logo.png";
import { useAuth } from "../api/AuthProvider";
import { adminRoutes, type AdminRoute } from "../routes";
import { useDocumentHead } from "../hooks/useDocumentHead";

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <img src={logo} alt="Logotipo de PROGRESEMOS" className="h-9 w-9 rounded-md object-cover" />
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-tight text-brand-gray-900">
          PROGRESEMOS
        </span>
        <span className="block text-[11px] font-semibold tracking-[0.14em] text-brand-green-dark/70">
          CMS
        </span>
      </span>
    </div>
  );
}

function NavList({ tabs, onNavigate }: { tabs: AdminRoute[]; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
      {tabs.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              isActive ? "bg-brand-green text-white" : "text-brand-gray-900/60 hover:bg-brand-gray-50"
            }`
          }
        >
          <Icon size={18} /> {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Admin() {
  useDocumentHead({ title: "Panel — PROGRESEMOS Puno 2026", robots: "noindex, nofollow" });

  const { session, logout } = useAuth();
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!session) return null;

  const { usuario } = session;
  const tabs = adminRoutes.filter(
    (route) => route.roles.length === 0 || route.roles.includes(usuario.rol?.nombre ?? ""),
  );
  const currentTab = tabs.find((tab) => pathname.startsWith(`/admin/${tab.path}`));

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Sidebar — fija en desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-brand-gray-900/10 bg-white lg:flex">
        <div className="flex h-18 items-center border-b border-brand-gray-900/10 px-6">
          <Brand />
        </div>

        <NavList tabs={tabs} />

        <div className="border-t border-brand-gray-900/10 p-4">
          <p className="truncate px-2 text-sm text-brand-gray-900/60">{usuario.nombre}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark"
          >
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Menú deslizante — solo en mobile */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-brand-gray-900/50 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-brand-gray-900/10 px-4">
                <Brand />
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-brand-gray-900"
                >
                  <X size={22} />
                </button>
              </div>

              <NavList tabs={tabs} onNavigate={() => setMobileNavOpen(false)} />

              <div className="border-t border-brand-gray-900/10 p-4">
                <p className="truncate px-2 text-sm text-brand-gray-900/60">{usuario.nombre}</p>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark"
                >
                  <LogOut size={15} /> Cerrar sesión
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Barra superior — persistente en todos los tamaños */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand-gray-900/10 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              aria-label={mobileNavOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="text-brand-gray-900"
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Brand />
          </div>

          <div className="hidden items-center gap-2.5 lg:flex">
            <img src={logo} alt="" className="h-6 w-6 rounded object-cover" />
            <span className="font-display text-sm font-bold text-brand-gray-900">
              {currentTab?.label ?? "Panel"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden text-sm font-medium text-brand-gray-900/70 sm:inline">
              {usuario.nombre}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-white">
              <UserRound size={18} />
            </span>
          </div>
        </header>

        <div className="container-editorial py-8">
          <div className="mb-8 flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-lime px-6 py-6 text-white sm:px-8 sm:py-7">
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                ¡Hola, {usuario.nombre}!
              </h1>
              <p className="mt-1.5 max-w-md text-sm text-white/80">
                Bienvenido al panel de PROGRESEMOS. Administra propuestas, noticias, comunicados
                y usuarios desde aquí.
              </p>
            </div>
            <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 sm:flex">
              <LayoutDashboard size={26} />
            </span>
          </div>

          <div className="max-w-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
