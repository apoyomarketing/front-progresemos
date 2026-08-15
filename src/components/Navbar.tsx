import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "../data/nav";
import logo from "../assets/progresemos-logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        scrolled || mobileOpen
          ? "bg-white/95 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <nav className="container-editorial flex h-18 items-center justify-between py-4">
        <a href="#inicio" className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="Logotipo de PROGRESEMOS"
            className={`h-9 w-9 rounded-md object-cover ring-1 transition-all ${
              scrolled || mobileOpen ? "ring-brand-gray-900/10" : "ring-white/30"
            }`}
          />
          <span className="leading-none">
            <span
              className={`block font-display text-lg font-bold tracking-tight transition-colors ${
                scrolled || mobileOpen ? "text-brand-gray-900" : "text-white"
              }`}
            >
              PROGRESEMOS
            </span>
            <span
              className={`block text-[11px] font-semibold tracking-[0.14em] transition-colors ${
                scrolled || mobileOpen ? "text-brand-green-dark/70" : "text-white/70"
              }`}
            >
              PUNO 2026
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-brand-gray-900/80 hover:text-brand-green" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <a
            href="#participa"
            className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
          >
            ÚNETE
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href="#participa"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              scrolled || mobileOpen
                ? "bg-brand-green text-white"
                : "bg-white/15 text-white backdrop-blur"
            }`}
          >
            Participa
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={scrolled || mobileOpen ? "text-brand-gray-900" : "text-white"}
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
            className="overflow-hidden bg-white lg:hidden"
          >
            <ul className="container-editorial flex flex-col gap-1 pb-8 pt-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
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
    </header>
  );
}
