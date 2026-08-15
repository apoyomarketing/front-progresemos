export interface LeaderProfile {
  name: string;
  role: string;
  region: string;
  description: string;
  photo: string;
}

export const leadership: LeaderProfile[] = [
  {
    name: "Lucio Istaña",
    role: "Candidato a la Alcaldía Provincial",
    region: "Puno",
    description:
      "Candidato de PROGRESEMOS a la Alcaldía de la Provincia de Puno, con una propuesta centrada en seguridad, modernidad y productividad para todos los distritos.",
    photo: "lucio",
  },
  {
    name: "Julio Choque",
    role: "Candidato a Regidor",
    region: "Puno",
    description:
      "Candidato de PROGRESEMOS a Regidor de la Provincia de Puno, comprometido con la gestión municipal y el trabajo territorial junto a los vecinos.",
    photo: "julio",
  },
];
