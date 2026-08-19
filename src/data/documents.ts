export interface DocumentEntry {
  icon: "hand-coins" | "wheat" | "heart-pulse" | "graduation-cap" | "briefcase" | "building-2";
  title: string;
  description: string;
}

export const documents: DocumentEntry[] = [
  {
    icon: "hand-coins",
    title: "Fin a la pobreza",
    description: "Poner fin a la pobreza en todas sus formas y en todo el mundo.",
  },
  {
    icon: "wheat",
    title: "Hambre cero",
    description:
      "Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición, y promover la agricultura sostenible.",
  },
  {
    icon: "heart-pulse",
    title: "Salud y bienestar",
    description: "Garantizar una vida sana y promover el bienestar de todos a todas las edades.",
  },
  {
    icon: "graduation-cap",
    title: "Educación de calidad",
    description:
      "Garantizar una educación inclusiva y equitativa de calidad y promover oportunidades de aprendizaje permanente para todos.",
  },
  {
    icon: "briefcase",
    title: "Trabajo decente y crecimiento económico",
    description:
      "Promover el crecimiento económico sostenido, inclusivo y sostenible, el empleo pleno y productivo y el trabajo decente para todos.",
  },
  {
    icon: "building-2",
    title: "  Ciudades y comunidades sostenibles",
    description:
      "Lograr que las ciudades y los asentamientos humanos sean inclusivos, seguros, resilientes y sostenibles.",
  },
];
