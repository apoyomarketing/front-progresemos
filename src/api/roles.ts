import { apiFetch } from "./client";
import type { ApiRolDetalle } from "./types";

export function listRoles(access: string): Promise<ApiRolDetalle[]> {
  return apiFetch<ApiRolDetalle[]>("roles/", { token: access });
}
