import { Lock } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon, XIcon } from "./SocialIcons";
import logo from "../assets/progresemos-logo.png";

const LOGIN_URL = "/login.html";

const columns = [
  {
    title: "Progresemos",
    links: [
      { label: "Sobre nosotros", href: "#nosotros" },
      { label: "Nuestra visión", href: "#nosotros" },
    ],
  },
  {
    title: "Participa",
    links: [
      { label: "Afiliación", href: "#participa" },
      { label: "Voluntariado", href: "#participa" },
      { label: "Contacto", href: "#participa" },
    ],
  },
  {
    title: "Información",
    links: [
      { label: "Noticias", href: "#noticias" },
      { label: "Documentos", href: "#transparencia" },
      { label: "Transparencia", href: "#transparencia" },
    ],
  },
];

const socials = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: TikTokIcon, label: "TikTok" },
  { icon: YoutubeIcon, label: "YouTube" },
  { icon: XIcon, label: "X" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-gray-900 pt-2 text-white">
      <div className="h-1 w-full bg-gradient-to-r from-brand-green via-brand-lime to-brand-yellow" />

      <div className="container-editorial py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Logotipo de PROGRESEMOS" className="h-9 w-9 rounded-md object-cover" />
              <span className="leading-none">
                <span className="block font-display text-lg font-bold tracking-tight">PROGRESEMOS</span>
                <span className="block text-[11px] font-semibold tracking-[0.14em] text-white/50">
                  PUNO 2026
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              Organización política comprometida con el desarrollo de la provincia
              de Puno: seguridad, modernidad y productividad para todos sus distritos.
            </p>

            <div className="mt-7">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40">
                Redes sociales
              </h4>
              <div className="mt-4 flex gap-3">
                {socials.map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand-lime hover:text-brand-lime"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Progresemos. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-white/80">Política de privacidad</a>
            <a href="#" className="hover:text-white/80">Términos</a>
            <a href="#" className="hover:text-white/80">Accesibilidad</a>
            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Iniciar sesión"
              title="Iniciar sesión"
              className="text-white/30 transition-colors hover:text-white/70"
            >
              <Lock size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
