import { apiFetch } from "./client";
import type {
  ApiUsuario,
  AuthResponse,
  CambiarPasswordPayload,
  LoginPayload,
  RegisterPayload,
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
