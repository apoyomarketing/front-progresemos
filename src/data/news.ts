export interface NewsItem {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  photo: string;
  image?: string;
  featured?: boolean;
}

export const news: NewsItem[] = [
  {
    category: "Institucional",
    date: "07 ago. 2026",
    title: "Reunión de coordinación reúne a dirigentes de la Provincia de Puno",
    excerpt:
      "Lucio Istaña y Julio Choque encabezaron el encuentro de coordinación con dirigentes y militantes de PROGRESEMOS en Pipos Salón de Eventos.",
    photo: "Reunión de coordinación — Provincia de Puno",
    image: "reunion",
    featured: true,
  },
  {
    category: "Candidatos",
    date: "26 jul. 2026",
    title: "PROGRESEMOS presenta a sus candidatos en Chucuito, Platería y Acora",
    excerpt:
      "La presentación de candidatos recorrió tres distritos de la provincia en una sola jornada, con la participación de vecinos y dirigentes locales.",
    photo: "Presentación de candidatos",
    image: "presentacion",
  },
  {
    category: "Propuestas",
    date: "28 jul. 2026",
    title: "Nuevo eje de innovación busca cerrar la brecha digital",
    excerpt: "El plan contempla conectividad y formación tecnológica en zonas rurales del altiplano.",
    photo: "Taller de innovación",
    image: "innovacion",
  },
  {
    category: "Participación",
    date: "20 jul. 2026",
    title: "Se abre convocatoria para voluntariado juvenil 2026",
    excerpt: "Jóvenes de la provincia podrán sumarse a las brigadas de trabajo territorial.",
    photo: "Voluntariado juvenil",
    image: "voluntariado",
  },
];
