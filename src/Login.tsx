import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import logo from "./assets/progresemos-logo.png";
import loginImage from "./assets/login/login.png";
import { useAuth } from "./api/AuthProvider";
import { ApiError } from "./api/client";
import { useDocumentHead } from "./hooks/useDocumentHead";

export default function Login() {
  useDocumentHead({ title: "Acceso — PROGRESEMOS Puno 2026", robots: "noindex, nofollow" });

  const { sessionMessage, login, clearSessionMessage } = useAuth();
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

  return (
    <div className="grid min-h-screen bg-brand-gray-900 font-body lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={loginImage}
          alt="Lucio Istaña, candidato a la Alcaldía, y Julio Choque, candidato a Regidor — PROGRESEMOS Puno 2026"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-brand-green via-brand-lime to-brand-yellow" />
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-3">
            <img src={logo} alt="Logotipo de PROGRESEMOS" className="h-11 w-11 rounded-lg object-cover" />
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-tight text-white">
                PROGRESEMOS
              </span>
              <span className="block text-[11px] font-semibold tracking-[0.14em] text-white/50">
                PUNO 2026
              </span>
            </span>
          </Link>

          <div className="mb-2 flex items-center gap-2 text-brand-lime">
            <Lock size={14} strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">Acceso interno</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Bienvenido de nuevo
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            Ingresa con tu cuenta del equipo para gestionar el contenido del sitio.
          </p>

          {sessionMessage && (
            <p className="mt-6 rounded-lg border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-2 text-sm text-brand-yellow">
              {sessionMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label htmlFor="login-correo" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Correo
              </label>
              <input
                id="login-correo"
                type="email"
                required
                autoFocus
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
                  required
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

          <p className="mt-8 text-center text-xs text-white/30">
            Acceso restringido al equipo de PROGRESEMOS Puno 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
