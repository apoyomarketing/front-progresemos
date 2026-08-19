import { useEffect, useState, type FormEvent } from "react";
import { UserPlus, KeyRound } from "lucide-react";
import { register, cambiarPassword, listUsuarios } from "../api/auth";
import { listRoles } from "../api/roles";
import { ApiError } from "../api/client";
import type { ApiUsuario, ApiRolDetalle } from "../api/types";
import type { WithAuth } from "../api/useAuthSession";

interface UsersPanelProps {
  currentUsuario: ApiUsuario;
  withAuth: WithAuth;
}

function EstadoBadge({ activo }: { activo: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        activo ? "bg-brand-green/10 text-brand-green-dark" : "bg-brand-gray-900/10 text-brand-gray-900/50"
      }`}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

export default function UsersPanel({ currentUsuario, withAuth }: UsersPanelProps) {
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [roles, setRoles] = useState<ApiRolDetalle[]>([]);

  const [creating, setCreating] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRol, setNewRol] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNuevo, setPasswordNuevo] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    withAuth(listUsuarios)
      .then((items) => {
        if (!cancelled) setUsuarios(items);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar la lista de usuarios.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    withAuth(listRoles)
      .then((items) => {
        if (!cancelled) setRoles(items.filter((r) => r.activo));
      })
      .catch(() => {
        // El selector de rol es un extra opcional: si falla, el formulario sigue
        // funcionando sin asignar rol.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreateSubmitting(true);
    try {
      // La respuesta de /register/ trae tokens de la cuenta recién creada — se descartan
      // a propósito, si no se pisaría la sesión del administrador que la está creando.
      const result = await withAuth((access) =>
        register(access, {
          nombre: newNombre,
          email: newEmail,
          password: newPassword,
          rol: newRol ? Number(newRol) : undefined,
        }),
      );
      setUsuarios((prev) => [result.usuario, ...prev]);
      setNewNombre("");
      setNewEmail("");
      setNewPassword("");
      setNewRol("");
      setCreating(false);
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : "No se pudo crear el usuario.");
    } finally {
      setCreateSubmitting(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (passwordNuevo.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (passwordNuevo !== passwordConfirm) {
      setPasswordError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    setPasswordSubmitting(true);
    try {
      const result = await withAuth((access) =>
        cambiarPassword(access, { password_actual: passwordActual, password_nuevo: passwordNuevo }),
      );
      setPasswordMessage(result.detail);
      setPasswordActual("");
      setPasswordNuevo("");
      setPasswordConfirm("");
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setPasswordSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand-gray-900">Usuarios</h2>
          {!creating && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
            >
              <UserPlus size={15} /> Nuevo usuario
            </button>
          )}
        </div>

        {creating && (
          <form
            onSubmit={handleCreate}
            className="mt-6 flex flex-col gap-4 rounded-xl border border-brand-gray-900/10 bg-brand-gray-50 p-5"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                Nombre
              </label>
              <input
                type="text"
                required
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
                className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                Correo
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                Rol (opcional)
              </label>
              <select
                value={newRol}
                onChange={(e) => setNewRol(e.target.value)}
                className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
              >
                <option value="">Sin rol</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            {createError && <p className="text-sm text-red-600">{createError}</p>}

            <div className="mt-2 flex gap-3">
              <button
                type="submit"
                disabled={createSubmitting}
                className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
              >
                {createSubmitting ? "Creando…" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setCreateError("");
                }}
                className="rounded-full border border-brand-gray-900/15 px-5 py-2.5 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:bg-white"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {loading && <p className="text-sm text-brand-gray-900/50">Cargando usuarios…</p>}
          {loadError && <p className="text-sm text-red-600">{loadError}</p>}
          {!loading && !loadError && usuarios.length === 0 && (
            <p className="rounded-xl border border-dashed border-brand-gray-900/15 p-6 text-center text-sm text-brand-gray-900/50">
              Todavía no hay usuarios.
            </p>
          )}
          {usuarios.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-4 rounded-xl border border-brand-gray-900/10 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-gray-900">{u.nombre}</p>
                <p className="truncate text-xs text-brand-gray-900/50">{u.email}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <EstadoBadge activo={u.estado} />
                {u.is_staff && (
                  <span className="rounded-full bg-brand-gray-900/5 px-2.5 py-0.5 text-xs font-medium text-brand-gray-900/50">
                    Staff
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    u.rol?.nombre === "Administrador"
                      ? "bg-brand-yellow/20 text-brand-gray-900/70"
                      : "bg-brand-gray-900/5 text-brand-gray-900/50"
                  }`}
                >
                  {u.rol?.nombre ?? "Sin rol"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <KeyRound size={16} className="text-brand-gray-900/50" />
          <h3 className="font-display text-base font-bold text-brand-gray-900">
            Cambiar mi contraseña ({currentUsuario.email})
          </h3>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="mt-4 flex max-w-sm flex-col gap-4 rounded-xl border border-brand-gray-900/10 bg-brand-gray-50 p-5"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
              Contraseña actual
            </label>
            <input
              type="password"
              required
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
              Nueva contraseña
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordNuevo}
              onChange={(e) => setPasswordNuevo(e.target.value)}
              className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
            />
          </div>

          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordMessage && <p className="text-sm text-brand-green-dark">{passwordMessage}</p>}

          <button
            type="submit"
            disabled={passwordSubmitting}
            className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
          >
            {passwordSubmitting ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
