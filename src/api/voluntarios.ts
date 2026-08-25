import { apiFetch } from "./client";

export interface PersonaReniec {
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_completo: string;
}

export interface Preinscripcion {
  codigo: string;
  nombre_completo: string;
  estado: string;
}

/** Paso 2 del modal: verifica el DNI contra RENIEC vía Decolecta. */
export function validarDni(dni: string): Promise<PersonaReniec> {
  return apiFetch<PersonaReniec>("voluntarios/validar-dni/", {
    method: "POST",
    body: { dni },
  });
}

/** Paso 3 del modal: crea la preinscripción. */
export function registrarVoluntario(datos: {
  dni: string;
  celular: string;
  acepta_whatsapp: boolean;
}): Promise<Preinscripcion> {
  return apiFetch<Preinscripcion>("voluntarios/", {
    method: "POST",
    body: datos,
  });
}
