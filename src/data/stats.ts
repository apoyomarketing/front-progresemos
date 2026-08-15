export interface StatItem {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

// Cifras demostrativas y editables del proyecto — no representan datos
// oficiales verificados. Reemplazar antes de la publicación.
export const stats: StatItem[] = [
  { value: 15, suffix: "", label: "Distritos de Puno" },
  { value: 100, prefix: "+", suffix: "", label: "Propuestas" },
  { value: 10, prefix: "+", suffix: "", label: "Ejes estratégicos" },
  { value: 50, prefix: "+", suffix: "mil", label: "Ciudadanos alcanzados" },
];
