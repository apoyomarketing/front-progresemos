import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "../data/nav";
import logo from "../assets/progresemos-logo.png";
import JoinModal from "./JoinModal";

interface NavbarProps {
  // Para páginas sin hero oscuro detrás (ej. /propuestas): el header arranca
  // ya en su estilo "con scroll" (fondo blanco, texto oscuro) en vez de
  // transparente con texto blanco, que quedaría invisible sobre fondo blanco.
  solid?: boolean;
}

export default function Navbar({ solid = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const isSolid = solid || scrolled || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isSolid
          ? "bg-white/95 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <nav className="container-editorial flex h-18 items-center justify-between py-4">
        <a href="/#inicio" className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="Logotipo de PROGRESEMOS"
            className={`h-9 w-9 rounded-md object-cover ring-1 transition-all ${
              isSolid ? "ring-brand-gray-900/10" : "ring-white/30"
            }`}
          />
          <span className="leading-none">
            <span
              className={`block font-display text-lg font-bold tracking-tight transition-colors ${
                isSolid ? "text-brand-gray-900" : "text-white"
              }`}
            >
              PROGRESEMOS
            </span>
            <span
              className={`block text-[11px] font-semibold tracking-[0.14em] transition-colors ${
                isSolid ? "text-brand-green-dark/70" : "text-white/70"
              }`}
            >
              PUNO 2026
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-x-4 gap-y-1 xl:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`whitespace-nowrap text-[13px] font-medium transition-colors ${
                  isSolid ? "text-brand-gray-900/80 hover:text-brand-green" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden xl:block">
          <button
            type="button"
            onClick={() => setJoinOpen(true)}
            className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
          >
            ÚNETE
          </button>
        </div>

        <div className="flex items-center gap-3 xl:hidden">
          <button
            type="button"
            onClick={() => setJoinOpen(true)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isSolid
                ? "bg-brand-green text-white"
                : "bg-white/15 text-white backdrop-blur"
            }`}
          >
            ÚNETE
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={isSolid ? "text-brand-gray-900" : "text-white"}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-white xl:hidden"
          >
            <ul className="container-editorial flex flex-col gap-1 pb-8 pt-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      // El menú bloquea el scroll de la página (body.style.overflow)
                      // mientras está abierto. Si dejamos que el navegador salte al
                      // ancla de forma nativa, lo hace antes de que el cierre del
                      // menú libere ese bloqueo, así que el salto se pierde. Por eso
                      // liberamos el scroll acá mismo y saltamos a mano.
                      document.body.style.overflow = "";
                      setMobileOpen(false);

                      const targetId = link.href.split("#")[1];
                      const target = document.getElementById(targetId);
                      if (target) {
                        // "smooth" se cancela en silencio acá: compite con la
                        // animación de cierre del menú (Framer Motion) corriendo en
                        // el mismo instante y el navegador aborta el scroll suave a
                        // medio camino.
                        target.scrollIntoView({ behavior: "instant" });
                      } else {
                        // La sección no existe en esta página (ej. estamos en
                        // /propuestas) — navega al inicio y salta ahí.
                        window.location.href = link.href;
                      }
                    }}
                    className="block rounded-lg px-3 py-3.5 font-display text-lg font-semibold text-brand-gray-900 hover:bg-brand-gray-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </header>
  );
}
