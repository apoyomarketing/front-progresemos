import candidatosPunoProvincia from "./candidatosPunoProvincia.json";

export interface Bien {
  tipo?: string;
  ubicacion?: string;
  placa?: string;
  valor?: number;
  nota?: string;
}

export interface AccionParticipacion {
  empresa: string;
  tipo: string;
  unidades: number;
  valor: number;
}

export interface Educacion {
  basica: string;
  tecnica: string;
  noUniversitaria: string;
  universitaria: string;
  posgrado: string;
}

export interface TrayectoriaPartidaria {
  cargosPartidarios?: string[];
  cargosEleccionPopular: string[];
  renuncias: string[];
}

export interface IngresosAnuales {
  remuneracionBruta: number;
  rentaBrutaEjercicioIndividual: number;
  otrosIngresos: number;
  total: number;
}

export interface Bienes {
  inmuebles: Bien[];
  muebles: Bien[];
  accionesYParticipaciones?: AccionParticipacion[];
}

export interface CandidatoJson {
  nombre: string;
  cargo: string;
  numeroLista: number | null;
  dni: string;
  sexo: string;
  fechaNacimiento: string;
  edad: number;
  lugarNacimiento: string;
  educacion: Educacion;
  experienciaLaboral: string[];
  trayectoriaPartidaria: TrayectoriaPartidaria;
  sentenciasFirmes: string;
  ingresosAnuales2025: IngresosAnuales | null;
  bienes: Bienes;
  resumenTrayectoria: string;
}

export interface CandidatoCompleto extends CandidatoJson {
  photo: string | null;
}

// Las fotos en src/assets/candidatos se nombran "<N> <lo que sea>.jpg", donde
// N = numeroLista + 1 (el alcalde, con numeroLista null, es el archivo "1").
// Ese desfase de 1 es la convenci\u00f3n acordada para la carpeta: cuando falte
// una foto, agregarla como "<numeroLista + 1> nombre apellido.jpg" y
// aparece sola, sin tocar este archivo. Hoy falta el archivo "7"
// (Nelly Ayde\u00e9 Zapana Apaza, numeroLista 6).
const modules = import.meta.glob<{ default: string }>("../assets/candidatos/*.{jpg,jpeg,png}", {
  eager: true,
});

const fotosPorNumeroDeArchivo = new Map<number, string>();
for (const [ruta, modulo] of Object.entries(modules)) {
  const archivo = ruta.split("/").pop() ?? "";
  const numero = Number(/^(\d+)/.exec(archivo)?.[1]);
  if (!Number.isNaN(numero)) fotosPorNumeroDeArchivo.set(numero, modulo.default);
}

function numeroDeArchivoEsperado(numeroLista: number | null): number {
  return numeroLista === null ? 1 : numeroLista + 1;
}

export const candidatosCompletos: CandidatoCompleto[] = (
  candidatosPunoProvincia.candidatos as CandidatoJson[]
)
  .slice()
  .sort((a, b) => (a.numeroLista ?? -1) - (b.numeroLista ?? -1))
  .map((c) => ({
    ...c,
    photo: fotosPorNumeroDeArchivo.get(numeroDeArchivoEsperado(c.numeroLista)) ?? null,
  }));

// Candidatos de la hoja de vida (JNE) para los que todavia no tenemos foto --
// referencia para saber a quien completarle la foto en src/assets/candidatos.
export const candidatosSinFoto: CandidatoCompleto[] = candidatosCompletos.filter((c) => !c.photo);
