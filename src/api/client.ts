import { API_BASE_URL } from "./config";
import type { DrfErrorBody } from "./types";

export function extractErrorMessage(body: unknown): string {
  if (body && typeof body === "object") {
    if ("detail" in body && typeof (body as { detail: unknown }).detail === "string") {
      return (body as { detail: string }).detail;
    }

    const entries = Object.entries(body as Record<string, unknown>);
    if (entries.length > 0) {
      return entries
        .map(([field, messages]) => {
          const text = Array.isArray(messages) ? messages.join(", ") : String(messages);
          return `${field}: ${text}`;
        })
        .join(" · ");
    }
  }

  return "Ocurrió un error inesperado.";
}

export class ApiError extends Error {
  status: number;
  body: DrfErrorBody | unknown;

  constructor(status: number, body: unknown) {
    super(extractErrorMessage(body));
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface ApiFetchOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  // FormData se envía tal cual (el navegador arma el boundary del
  // multipart); todo lo demás se serializa como JSON.
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data as T;
}
