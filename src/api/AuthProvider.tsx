import { createContext, useContext, type ReactNode } from "react";
import { useAuthSession } from "./useAuthSession";

type AuthSession = ReturnType<typeof useAuthSession>;

const AuthContext = createContext<AuthSession | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthSession();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthSession {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
