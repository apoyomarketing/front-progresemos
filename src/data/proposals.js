// Contenido de ejemplo. Reemplazar cada propuesta con información real
// antes de publicar el sitio.
export const categories = [
  "Educación",
  "Salud",
  "Economía",
  "Infraestructura",
  "Seguridad",
  "Medio ambiente",
  "Tecnología",
  "Desarrollo regional",
];

// icon: nombre de un icono de lucide-react (ver Proposals.jsx para el mapeo)
export const proposals = categories.flatMap((category, i) =>
  [1, 2].map((n) => ({
    id: `${i + 1}.${n}`,
    category,
    title: `Propuesta de ejemplo en ${category.toLowerCase()}`,
    description:
      "Contenido de ejemplo. Reemplazar con el detalle real de la propuesta antes de publicar.",
  }))
);
