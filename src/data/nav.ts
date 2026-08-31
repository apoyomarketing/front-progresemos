export interface NavLink {
  label: string;
  href: string;
}

// Con "/" al inicio para que funcionen igual desde el landing (scroll dentro
// de la misma página) que desde otras páginas como /propuestas (navegan de
// vuelta al inicio y ahí saltan a la sección). Mismo orden que las secciones
// en App.tsx.
export const navLinks: NavLink[] = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Propuestas", href: "/#propuestas" },
  { label: "Candidatos", href: "/#candidatos" },
  { label: "Noticias", href: "/#noticias" },
  { label: "Juegos", href: "/#juegos" },
  { label: "Galería", href: "/#galeria" },
  { label: "Participa", href: "/#participa" },
];
