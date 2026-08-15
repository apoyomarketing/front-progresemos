export interface Axis {
  number: string;
  icon: "graduation-cap" | "heart-pulse" | "shield-check" | "trending-up" | "hammer" | "sprout" | "cpu" | "map";
  title: string;
  description: string;
  size: "lg" | "md" | "sm";
  photo?: string;
}

export const axes: Axis[] = [
  {
    number: "01",
    icon: "graduation-cap",
    title: "Educación",
    description:
      "Una educación moderna, accesible y orientada al futuro, que prepare a nuestros jóvenes para los retos del siglo XXI.",
    size: "lg",
    photo: "Aula rural — Puno",
  },
  {
    number: "02",
    icon: "heart-pulse",
    title: "Salud",
    description: "Servicios de salud dignos, modernos y cercanos a cada familia peruana.",
    size: "sm",
  },
  {
    number: "03",
    icon: "shield-check",
    title: "Seguridad",
    description: "Ciudades más seguras e instituciones eficientes al servicio del ciudadano.",
    size: "sm",
  },
  {
    number: "04",
    icon: "trending-up",
    title: "Economía",
    description:
      "Más oportunidades para emprendedores y trabajadores, con reglas claras y crecimiento sostenible.",
    size: "md",
    photo: "Mercado local — Altiplano",
  },
  {
    number: "05",
    icon: "hammer",
    title: "Infraestructura",
    description: "Obras que conecten y desarrollen nuestras regiones, cerrando brechas históricas.",
    size: "sm",
  },
  {
    number: "06",
    icon: "sprout",
    title: "Agricultura",
    description: "Mayor productividad y oportunidades para nuestros productores del campo.",
    size: "sm",
  },
  {
    number: "07",
    icon: "cpu",
    title: "Innovación",
    description: "Tecnología e innovación para acelerar el desarrollo del país.",
    size: "md",
    photo: "Jóvenes y tecnología",
  },
  {
    number: "08",
    icon: "map",
    title: "Desarrollo Regional",
    description: "Impulsar oportunidades y crecimiento equitativo en todas las regiones del Perú.",
    size: "sm",
  },
];
