import { apiFetch } from "./client";

export interface ApiActividad {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  fecha: string;
  lugar: string;
  estado: string;
}

export type ActividadPayload = Partial<Omit<ApiActividad, "id">>;

// Choices reales del modelo Actividad (back-progresemos/app/asistencia/models.py).
// "cancelado" es el marcador de borrado lógico que usa eliminarActividad.
export const ESTADOS_ACTIVIDAD = [
  { value: "programado", label: "Programado" },
  { value: "en_curso", label: "En curso" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
] as const;

export function listActividades(access: string): Promise<ApiActividad[]> {
  return apiFetch<ApiActividad[]>("actividades/", { token: access });
}

export function obtenerActividad(access: string, id: number): Promise<ApiActividad> {
  return apiFetch<ApiActividad>(`actividades/${id}/`, { token: access });
}

export function crearActividad(access: string, payload: ActividadPayload): Promise<ApiActividad> {
  return apiFetch<ApiActividad>("actividades/crear/", { method: "POST", body: payload, token: access });
}

export function actualizarActividad(
  access: string,
  id: number,
  payload: ActividadPayload,
): Promise<ApiActividad> {
  return apiFetch<ApiActividad>(`actividades/${id}/actualizar/`, {
    method: "POST",
    body: payload,
    token: access,
  });
}

/** La API no borra la actividad: la marca con estado "cancelado". */
export function eliminarActividad(access: string, id: number): Promise<ApiActividad> {
  return apiFetch<ApiActividad>(`actividades/${id}/eliminar/`, { method: "POST", token: access });
}
