import { apiFetch } from "./client";

export interface ApiPropuesta {
  id: number;
  titulo: string;
  foto: string;
  descripcion: string;
  orden: number;
}

// A diferencia de propuestas.foto (validado como imagen), noticias.multimedia
// es un solo campo de archivo que acepta foto o video indistintamente.
export interface ApiNoticia {
  id: number;
  titulo: string;
  multimedia: string;
  descripcion: string;
  fecha: string;
  lugar: string;
}

export interface ApiComunicado {
  id: number;
  titulo: string;
  multimedia: string;
  descripcion: string;
  fecha: string;
}

export type ContentFields = Record<string, string | File | undefined>;

function toFormData(fields: ContentFields): FormData {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value);
  });
  return formData;
}

// Las rutas de escritura son POST dedicados (crear/, {id}/actualizar/,
// {id}/eliminar/) en vez de POST/PUT/DELETE sobre el recurso — así expone
// la API el CRUD de contenido del CMS.
function contentApi<T extends { id: number }>(resource: string) {
  return {
    list: () => apiFetch<T[]>(`${resource}/`),
    create: (access: string, fields: ContentFields) =>
      apiFetch<T>(`${resource}/crear/`, { method: "POST", body: toFormData(fields), token: access }),
    update: (access: string, id: number, fields: ContentFields) =>
      apiFetch<T>(`${resource}/${id}/actualizar/`, { method: "POST", body: toFormData(fields), token: access }),
    remove: (access: string, id: number) =>
      apiFetch<void>(`${resource}/${id}/eliminar/`, { method: "POST", token: access }),
  };
}

export const propuestasApi = contentApi<ApiPropuesta>("propuestas");
export const noticiasApi = contentApi<ApiNoticia>("noticias");
export const comunicadosApi = contentApi<ApiComunicado>("comunicados");
