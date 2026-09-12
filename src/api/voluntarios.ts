import { apiFetch } from "./client";

export interface PersonaReniec {
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_completo: string;
}

export interface Preinscripcion {
  codigo: string;
  dni: string;
  nombre_completo: string;
  estado: string;
  foto: string | null;
  fecha_afiliacion: string;
  rol_afiliado?: string;
}

export interface ApiRolAfiliado {
  id: number;
  rol_name: string;
}

export function listarRolesAfiliado(access: string): Promise<ApiRolAfiliado[]> {
  return apiFetch<ApiRolAfiliado[]>("afiliado-rol/", { token: access });
}

/** Paso 2 del modal: verifica el DNI contra RENIEC vía Decolecta. */
export function validarDni(dni: string): Promise<PersonaReniec> {
  return apiFetch<PersonaReniec>("voluntarios/validar-dni/", {
    method: "POST",
    body: { dni },
  });
}

/** Paso 3 del modal: crea la preinscripción. */
export function registrarVoluntario(datos: {
  dni: string;
  celular: string;
  acepta_whatsapp: boolean;
}): Promise<Preinscripcion> {
  return apiFetch<Preinscripcion>("voluntarios/", {
    method: "POST",
    body: datos,
  });
}

/** Paso de foto: sube la foto del carnet para una preinscripción ya creada. */
export function subirFotoVoluntario(codigo: string, archivo: File): Promise<Preinscripcion> {
  const formData = new FormData();
  formData.append("foto", archivo);
  return apiFetch<Preinscripcion>(`voluntarios/${codigo}/foto/`, {
    method: "POST",
    body: formData,
  });
}

/** Regenerar carnet: trae el registro ya guardado de alguien que ya se afilió. */
export function obtenerVoluntarioPorDni(dni: string): Promise<Preinscripcion> {
  return apiFetch<Preinscripcion>(`voluntarios/${dni}/`);
}

/** Reemplaza la foto de un voluntario ya registrado (identificado por DNI, no por código). Público. */
export function actualizarFotoVoluntario(dni: string, archivo: File): Promise<Preinscripcion> {
  const formData = new FormData();
  formData.append("foto", archivo);
  return apiFetch<Preinscripcion>(`voluntarios/${dni}/actualizar-foto/`, {
    method: "POST",
    body: formData,
  });
}

// Vista de administración (Admin/Editor/Coordinador): incluye "id" (el PK interno
// que piden los endpoints de asistencia como voluntario_id) y "rol_afiliado".
export interface ApiVoluntario extends Preinscripcion {
  id: number;
  rol_afiliado: string;
}

export const ROLES_AFILIADO = [
  { value: "afiliado", label: "Afiliado" },
  { value: "simpatizante", label: "Simpatizante" },
  { value: "organizador", label: "Organizador" },
] as const;

/** Panel CMS: busca afiliados por DNI y/o nombre (ambos parciales y opcionales). */
export function buscarVoluntarios(
  access: string,
  filtros: { dni?: string; nombre?: string },
): Promise<ApiVoluntario[]> {
  const query = new URLSearchParams();
  if (filtros.dni) query.set("dni", filtros.dni);
  if (filtros.nombre) query.set("nombre", filtros.nombre);
  const qs = query.toString();
  return apiFetch<ApiVoluntario[]>(`voluntarios/buscar/${qs ? `?${qs}` : ""}`, { token: access });
}

/** Panel CMS / Público: reasigna el rol de afiliado (afiliado/simpatizante/organizador/personero). */
export function actualizarRolVoluntario(
  access: string | undefined,
  codigo: string,
  rolAfiliado: string,
): Promise<ApiVoluntario> {
  return apiFetch<ApiVoluntario>(`voluntarios/${codigo}/rol/`, {
    method: "POST",
    body: { rol_afiliado: rolAfiliado },
    token: access,
  });
}

/** Panel CMS: baja lógica del afiliado (estado pasa a "baja", no se borra la fila). */
export function eliminarVoluntario(access: string, codigo: string): Promise<ApiVoluntario> {
  return apiFetch<ApiVoluntario>(`voluntarios/${codigo}/eliminar/`, { method: "POST", token: access });
}
