import { apiFetch } from "./client";

export interface LocalVotacion {
  id_local: number;
  provincia: string;
  distrito: string;
  nombre_local: string;
  direccion_local: string;
  cant_mesas: number;
  electores_regional: number;
  electores_municipal: number;
}

export interface Partido {
  id_partido: number;
  nombre_partido: string;
  categoria: string;
}

export interface VotosPayload {
  id_local: number;
  nro_mesa: number | string;
  tipo_eleccion: string;
  votos: { id_partido: number; cant_voto: number }[];
}

export interface ResultadoProvincial {
  partido__nombre_partido: string;
  total_votos: number;
}

export interface ResultadoLocal {
  resultados_partidos: {
    partido__nombre_partido: string;
    total_votos: number;
  }[];
  total_emitido: number;
  electores_habiles: number;
  pct_participacion: number;
}

export interface MatrizElemento {
  id_local: number;
  provincia: string;
  distrito: string;
  nombre_local: string;
  direccion_local: string;
  nro_mesa: number | string;
  votos_partidos: Record<string, number>;
  total_votos: number;
}

export interface MatrizRespuesta {
  tipo_eleccion: string;
  partidos: string[];
  matriz: MatrizElemento[];
  totales_partidos: Record<string, number>;
  gran_total_votos: number;
}

export async function listarLocales(params?: { provincia?: string; distrito?: string }): Promise<LocalVotacion[]> {
  const query = new URLSearchParams();
  if (params?.provincia) query.append("provincia", params.provincia);
  if (params?.distrito) query.append("distrito", params.distrito);

  const qStr = query.toString();
  return apiFetch<LocalVotacion[]>(`escrutinio/locales/${qStr ? `?${qStr}` : ""}`);
}

export async function listarPartidos(): Promise<Partido[]> {
  return apiFetch<Partido[]>("escrutinio/partidos/");
}

export async function registrarVotos(payload: VotosPayload, token: string): Promise<{ mensaje: string }> {
  return apiFetch<{ mensaje: string }>("escrutinio/votos/", {
    method: "POST",
    body: payload,
    token,
  });
}

export interface EstadoMesaRespuesta {
  tipos_registrados: string[];
}

export async function consultarEstadoMesa(
  id_local: number,
  nro_mesa: number | string,
  token: string
): Promise<EstadoMesaRespuesta> {
  const query = new URLSearchParams({
    id_local: String(id_local),
    nro_mesa: String(nro_mesa),
  });
  return apiFetch<EstadoMesaRespuesta>(`escrutinio/votos/estado/?${query.toString()}`, {
    token,
  });
}

export async function obtenerResultadosProvinciales(params?: { provincia?: string; tipo?: string }): Promise<ResultadoProvincial[]> {
  const query = new URLSearchParams();
  if (params?.provincia) query.append("provincia", params.provincia);
  if (params?.tipo) query.append("tipo", params.tipo);

  const qStr = query.toString();
  return apiFetch<ResultadoProvincial[]>(`escrutinio/resultados/provincial/${qStr ? `?${qStr}` : ""}`);
}

export async function obtenerResultadosLocal(localId: number, tipo?: string): Promise<ResultadoLocal> {
  const query = new URLSearchParams();
  if (tipo) query.append("tipo", tipo);

  const qStr = query.toString();
  return apiFetch<ResultadoLocal>(`escrutinio/resultados/local/${localId}/${qStr ? `?${qStr}` : ""}`);
}

export async function obtenerMatrizEscrutinio(params?: {
  provincia?: string;
  distrito?: string;
  tipo?: string;
}): Promise<MatrizRespuesta> {
  const query = new URLSearchParams();
  if (params?.provincia) query.append("provincia", params.provincia);
  if (params?.distrito) query.append("distrito", params.distrito);
  if (params?.tipo) query.append("tipo", params.tipo);

  const qStr = query.toString();
  return apiFetch<MatrizRespuesta>(`escrutinio/matriz/${qStr ? `?${qStr}` : ""}`);
}

export interface DashboardResultadosRespuesta {
  modo: string;
  tipo_eleccion: string;
  provincia?: string;
  distrito?: string;
  id_local?: number;
  nro_mesa?: string | number;
  total_emitido: number;
  electores_habiles: number;
  pct_participacion: number;
  partido_lider: {
    nombre_partido: string;
    total_votos: number;
    porcentaje: number;
  } | null;
  resultados_partidos: {
    nombre_partido: string;
    total_votos: number;
    porcentaje: number;
  }[];
}

export interface CoberturaLocal {
  id_local: number;
  nombre_local: string;
  distrito: string;
  provincia: string;
  mesas_esperadas: number;
  mesas_registradas: number;
  mesas_faltantes: number;
  pct_cobertura: number;
}

export interface CoberturaRespuesta {
  filtros?: { distrito: string | null; id_local: number | null };
  resumen: {
    total_locales: number;
    total_mesas_esperadas: number;
    total_mesas_registradas: number;
    total_mesas_faltantes: number;
    pct_cobertura_global: number;
  };
  locales: CoberturaLocal[];
}

export async function obtenerCoberturaMesas(params?: {
  distrito?: string;
  id_local?: number;
}): Promise<CoberturaRespuesta> {
  const query = new URLSearchParams();
  if (params?.distrito) query.append("distrito", params.distrito);
  if (params?.id_local) query.append("id_local", params.id_local.toString());

  const qStr = query.toString();
  return apiFetch<CoberturaRespuesta>(`escrutinio/cobertura/${qStr ? `?${qStr}` : ""}`);
}

export async function obtenerDashboardResultados(params?: {
  tipo?: string;
  modo?: string;
  provincia?: string;
  distrito?: string;
  id_local?: number;
  nro_mesa?: string | number;
}): Promise<DashboardResultadosRespuesta> {
  const query = new URLSearchParams();
  if (params?.tipo) query.append("tipo", params.tipo);
  if (params?.modo) query.append("modo", params.modo);
  if (params?.provincia) query.append("provincia", params.provincia);
  if (params?.distrito) query.append("distrito", params.distrito);
  if (params?.id_local) query.append("id_local", params.id_local.toString());
  if (params?.nro_mesa) query.append("nro_mesa", params.nro_mesa.toString());

  const qStr = query.toString();
  return apiFetch<DashboardResultadosRespuesta>(`escrutinio/resultados/dashboard/${qStr ? `?${qStr}` : ""}`);
}





