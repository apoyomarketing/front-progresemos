export interface Candidato {
  orden: number;
  nombre: string;
  photo: string;
}

// Vite arma un mapa { ruta: módulo } con todos los flyers de la carpeta —
// evita escribir un import individual por cada archivo (11 y creciendo).
const modules = import.meta.glob<{ default: string }>("../assets/candidatos/*.{jpg,jpeg,png}", {
  eager: true,
});

// El nombre de archivo trae el número de la lista siempre, pero el nombre
// completo solo en el 1 y el 2 — el resto solo tiene apellidos. Se completan
// leyendo el nombre que ya trae impreso cada flyer.
const NOMBRES: Record<number, string> = {
  1: "Lucio Istaña Ramos",
  2: "Julio César Choque Vargas",
  3: "Nelly Edith Mamani Quispe",
  4: "Wilfredo Mamani Tisnado",
  5: "Dulia Coya Ccañiahua",
  6: "Wily Leopoldo Velasquez Velasquez",
  7: "Joby Johan Parhuayo Jimenez",
  8: "Ruth Carolina Llanqui Mamani",
  9: "Efrain Suasaca Quispe",
  10: "Yeni Noemi Chura Choque",
  12: "Yenny Ylaquita Panca",
};

export const leadership: Candidato[] = Object.entries(modules)
  .map(([path, mod]) => {
    const archivo = path.split("/").pop() ?? "";
    const orden = Number(/^(\d+)/.exec(archivo)?.[1] ?? 0);
    return { orden, nombre: NOMBRES[orden] ?? archivo, photo: mod.default };
  })
  .sort((a, b) => a.orden - b.orden);
