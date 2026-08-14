import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "El Partido", href: "/#partido" },
  { label: "Propuestas", href: "/propuestas" },
  { label: "Candidato", href: "/candidato" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Noticias", href: "/noticias" },
  { label: "Documentos", href: "/#documentos" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          className={`flex items-center gap-2 font-display font-extrabold text-lg md:text-xl tracking-tight ${
            scrolled ? "text-verde-profundo" : "text-white"
          }`}
        >
          <span
            className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-extrabold text-sm ${
              scrolled ? "bg-verde-principal text-white" : "bg-white text-verde-oscuro"
            }`}
          >
            P
          </span>
          PROGRESEMOS
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors focus-ring rounded ${
                scrolled ? "text-gristexto hover:text-verde-oscuro" : "text-white/90 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Link
          to="/propuestas"
          className="hidden lg:inline-flex items-center gap-1.5 bg-verde-principal hover:bg-verde-oscuro text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors focus-ring"
        >
          Ver propuestas <ArrowRight size={16} />
        </Link>

        <button
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
          className={`lg:hidden ${scrolled ? "text-verde-profundo" : "text-white"} focus-ring rounded`}
        >
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 bg-verde-profundo z-50 flex flex-col">
          <div className="flex items-center justify-between h-16 px-5">
            <span className="text-white font-display font-extrabold">PROGRESEMOS</span>
            <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="text-white focus-ring rounded">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-6 mt-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-white/90 hover:text-white text-lg py-3 border-b border-white/10 focus-ring rounded"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/propuestas"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex justify-center items-center gap-1.5 bg-verde-lima text-verde-profundo font-semibold px-4 py-3 rounded-full"
            >
              Ver propuestas <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
