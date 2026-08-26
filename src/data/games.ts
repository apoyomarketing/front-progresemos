export interface GameEntry {
  slug: "numpuz" | "rompecabezas";
  icon: "grid" | "puzzle";
  title: string;
  description: string;
}

export const games: GameEntry[] = [
  {
    slug: "numpuz",
    icon: "grid",
    title: "Numpuz",
    description: "Ordena las fichas numeradas en el menor número de movimientos posible.",
  },
  {
    slug: "rompecabezas",
    icon: "puzzle",
    title: "Rompecabezas",
    description: "Arma la imagen de campaña moviendo las piezas hasta completarla.",
  },
];
