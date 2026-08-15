export interface Proposal {
  number: string;
  category: string;
  title: string;
  description: string;
  photo: string;
  imageSide: "left" | "right";
}

export const proposals: Proposal[] = [
  {
    number: "01",
    category: "Educación",
    title: "Escuelas conectadas para el futuro",
    description:
      "Un plan nacional de modernización educativa que lleve conectividad, infraestructura digna y formación docente continua a las zonas rurales y urbanas por igual.",
    photo: "Estudiantes en clase",
    imageSide: "left",
  },
  {
    number: "02",
    category: "Salud",
    title: "Salud cercana, sin barreras",
    description:
      "Fortalecimiento de la red de postas y hospitales regionales, con telemedicina para comunidades alejadas del altiplano y la sierra.",
    photo: "Centro de salud regional",
    imageSide: "right",
  },
  {
    number: "03",
    category: "Agricultura",
    title: "Del campo peruano al mundo",
    description:
      "Acceso a tecnología, financiamiento y mercados justos para que la producción agrícola de nuestras regiones compita con calidad y valor agregado.",
    photo: "Cultivos del altiplano",
    imageSide: "left",
  },
];
