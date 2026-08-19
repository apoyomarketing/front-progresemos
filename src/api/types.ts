export interface ApiRol {
  id: number;
  nombre: string;
}

export interface ApiRolDetalle extends ApiRol {
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiUsuario {
  id: number;
  nombre: string;
  email: string;
  estado: boolean;
  is_staff: boolean;
  rol: ApiRol | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  usuario: ApiUsuario;
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
  rol?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CambiarPasswordPayload {
  password_actual: string;
  password_nuevo: string;
}

export interface DrfDetailError {
  detail: string;
}

export type DrfFieldErrors = Record<string, string[]>;

export type DrfErrorBody = DrfDetailError | DrfFieldErrors;
