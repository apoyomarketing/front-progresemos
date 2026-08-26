export interface NavLink {
  label: string;
  href: string;
}

// Con "/" al inicio para que funcionen igual desde el landing (scroll dentro
// de la misma página) que desde otras páginas como /propuestas (navegan de
// vuelta al inicio y ahí saltan a la sección).
export const navLinks: NavLink[] = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Candidatos", href: "/#candidatos" },
  { label: "Propuestas", href: "/#propuestas" },
  { label: "Noticias", href: "/#noticias" },
];
