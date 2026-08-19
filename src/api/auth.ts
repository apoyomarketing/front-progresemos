import { apiFetch } from "./client";
import type {
  AdminResetPasswordPayload,
  ApiUsuario,
  AuthResponse,
  CambiarPasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateUsuarioPayload,
} from "./types";

// Requiere el token de un Administrador — register ya no es público. La respuesta trae
// tokens de la cuenta recién creada, no de quien la crea; el llamador debe descartarlos.
export function register(access: string, payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("usuarios/register/", { method: "POST", body: payload, token: access });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("usuarios/login/", { method: "POST", body: payload });
}

export function logout(access: string, refresh: string): Promise<void> {
  return apiFetch<void>("usuarios/logout/", { method: "POST", body: { refresh }, token: access });
}

export function cambiarPassword(
  access: string,
  payload: CambiarPasswordPayload,
): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>("usuarios/cambiar-password/", {
    method: "POST",
    body: payload,
    token: access,
  });
}

export function listUsuarios(access: string): Promise<ApiUsuario[]> {
  return apiFetch<ApiUsuario[]>("usuarios/", { token: access });
}

export function updateUsuario(
  access: string,
  id: number,
  payload: UpdateUsuarioPayload,
): Promise<ApiUsuario> {
  return apiFetch<ApiUsuario>(`usuarios/${id}/actualizar/`, {
    method: "POST",
    body: payload,
    token: access,
  });
}

// El backend bloquea eliminarse a uno mismo (400) — el frontend además oculta
// el botón para el usuario actual, ver UsersPanel.tsx.
export function deleteUsuario(access: string, id: number): Promise<ApiUsuario> {
  return apiFetch<ApiUsuario>(`usuarios/${id}/eliminar/`, { method: "POST", token: access });
}

// Resetea la contraseña de OTRO usuario (no pide la actual, a diferencia de
// cambiarPassword). El backend bloquea usar esto sobre uno mismo.
export function resetUsuarioPassword(
  access: string,
  id: number,
  payload: AdminResetPasswordPayload,
): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>(`usuarios/${id}/cambiar-password/`, {
    method: "POST",
    body: payload,
    token: access,
  });
}
