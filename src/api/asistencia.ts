import { apiFetch } from "./client";

export interface ApiAsistencia {
  id: number;
  voluntario_id: number;
  actividad_id: number;
  estado: string;
  observacion: string;
  created_at: string;
}

export interface AsistenciaPayload {
  voluntario_id: number;
  actividad_id: number;
  estado: string;
  observacion?: string;
}

export function crearAsistencia(access: string, payload: AsistenciaPayload): Promise<ApiAsistencia> {
  return apiFetch<ApiAsistencia>("asistencia/crear/", { method: "POST", body: payload, token: access });
}

export function listAsistencia(
  access: string,
  filtros?: { actividad_id?: number; voluntario_id?: number },
): Promise<ApiAsistencia[]> {
  const query = new URLSearchParams();
  if (filtros?.actividad_id) query.set("actividad_id", String(filtros.actividad_id));
  if (filtros?.voluntario_id) query.set("voluntario_id", String(filtros.voluntario_id));
  const qs = query.toString();
  return apiFetch<ApiAsistencia[]>(`asistencia/${qs ? `?${qs}` : ""}`, { token: access });
}

export function actualizarAsistencia(
  access: string,
  id: number,
  payload: { estado: string; observacion?: string },
): Promise<ApiAsistencia> {
  return apiFetch<ApiAsistencia>(`asistencia/${id}/actualizar/`, {
    method: "POST",
    body: payload,
    token: access,
  });
}

/** La API no borra el registro: la marca con estado "eliminado". */
export function eliminarAsistencia(access: string, id: number): Promise<ApiAsistencia> {
  return apiFetch<ApiAsistencia>(`asistencia/${id}/eliminar/`, { method: "POST", token: access });
}
