import { useState, type FormEvent } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import logo from "./assets/progresemos-logo.png";
import { useAuthSession } from "./api/useAuthSession";
import { ApiError } from "./api/client";
import Admin from "./cms/Admin";

export default function Login() {
  const { session, sessionMessage, login, logout, withAuth, clearSessionMessage } = useAuthSession();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    clearSessionMessage();
    setSubmitting(true);
    try {
      await login(correo.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  if (session) {
    return <Admin usuario={session.usuario} withAuth={withAuth} onLogout={logout} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gray-900 px-4 font-body">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="Logotipo de PROGRESEMOS" className="h-12 w-12 rounded-lg object-cover" />
          <span className="leading-none">
            <span className="block font-display text-lg font-bold tracking-tight text-white">
              PROGRESEMOS
            </span>
            <span className="block text-[11px] font-semibold tracking-[0.14em] text-white/50">
              PUNO 2026
            </span>
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center gap-2 text-white/70">
            <Lock size={16} strokeWidth={2} />
            <h1 className="font-display text-base font-bold text-white">Acceso interno</h1>
          </div>

          {sessionMessage && (
            <p className="mb-4 rounded-lg border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-2 text-sm text-brand-yellow">
              {sessionMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-correo" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Correo
              </label>
              <input
                id="login-correo"
                type="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-brand-lime"
                placeholder="correo@progresemos.pe"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 pr-11 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-brand-lime"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
            >
              {submitting ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Acceso restringido al equipo de PROGRESEMOS Puno 2026.
        </p>
      </div>
    </div>
  );
}
