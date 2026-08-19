import { useState } from "react";
import * as auth from "./auth";
import { ApiError } from "./client";
import type { ApiUsuario } from "./types";

const STORAGE_KEY = "progresemos_session";
const ACCESS_LIFETIME_MS = 60 * 60 * 1000; // 1 hora, según la referencia de la API

interface StoredSession {
  usuario: ApiUsuario;
  access: string;
  refresh: string;
  accessExpiresAt: number;
}

export type WithAuth = <T>(fn: (access: string) => Promise<T>) => Promise<T>;

function loadSession(): StoredSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed.accessExpiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function useAuthSession() {
  const [session, setSession] = useState<StoredSession | null>(loadSession);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  function persist(next: StoredSession | null) {
    setSession(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const result = await auth.login({ email, password });
    persist({
      usuario: result.usuario,
      access: result.access,
      refresh: result.refresh,
      accessExpiresAt: Date.now() + ACCESS_LIFETIME_MS,
    });
  }

  async function logout(): Promise<void> {
    if (session) {
      try {
        await auth.logout(session.access, session.refresh);
      } catch {
        // El token ya pudo haber expirado o quedar invalidado; igual limpiamos la sesión local.
      }
    }
    persist(null);
  }

  const withAuth: WithAuth = async (fn) => {
    if (!session) {
      throw new Error("No hay una sesión activa.");
    }
    try {
      return await fn(session.access);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        persist(null);
        setSessionMessage("Tu sesión expiró, inicia sesión de nuevo.");
      }
      throw err;
    }
  };

  function clearSessionMessage() {
    setSessionMessage(null);
  }

  return { session, sessionMessage, login, logout, withAuth, clearSessionMessage };
}
