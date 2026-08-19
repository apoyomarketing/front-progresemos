const rawBaseUrl = import.meta.env.VITE_API_URL;

if (!rawBaseUrl) {
  throw new Error("Falta VITE_API_URL en .env — la API no tiene una URL base configurada.");
}

// Normaliza para que siempre termine en "/", así los paths se pueden concatenar sin duplicar barras.
export const API_BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;
