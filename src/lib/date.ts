// La API devuelve `fecha` como ISO ("2026-08-07") o null (el campo es
// opcional en el modelo de Noticia). Esto la lleva al formato de display
// que antes estaba hardcodeado en los datos estáticos ("07 ago. 2026").
export function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "";

  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
