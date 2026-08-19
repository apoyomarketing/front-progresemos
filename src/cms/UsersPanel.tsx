import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { UserPlus, KeyRound, Pencil, Trash2, RotateCcw, X } from "lucide-react";
import { register, listUsuarios, updateUsuario, deleteUsuario, resetUsuarioPassword } from "../api/auth";
import { listRoles } from "../api/roles";
import { ApiError } from "../api/client";
import type { ApiUsuario, ApiRolDetalle, UpdateUsuarioPayload } from "../api/types";
import type { WithAuth } from "../api/useAuthSession";
import ConfirmDialog from "./ConfirmDialog";

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

  // Modal de crear/editar
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<ApiUsuario | null>(null);
  const [formNombre, setFormNombre] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRol, setFormRol] = useState("");
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<UpdateUsuarioPayload | null>(null);
  const formTitleId = useId();
  const formBodyRef = useRef<HTMLDivElement>(null);

  // Eliminar / reactivar
  const [pendingDelete, setPendingDelete] = useState<ApiUsuario | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [reactivatingId, setReactivatingId] = useState<number | null>(null);
  const [reactivateError, setReactivateError] = useState("");

  // Resetear contraseña de otro usuario
  const [resetTarget, setResetTarget] = useState<ApiUsuario | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [pendingReset, setPendingReset] = useState(false);
  const resetTitleId = useId();
  const resetFieldRef = useRef<HTMLInputElement>(null);

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

  const isFormOpen = formMode !== null;

  useEffect(() => {
    if (!isFormOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    formBodyRef.current?.querySelector<HTMLElement>("input, select")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeForm();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpen]);

  useEffect(() => {
    if (!resetTarget) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    resetFieldRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeReset();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTarget]);

  function openCreate() {
    setFormMode("create");
    setEditingUser(null);
    setFormNombre("");
    setFormEmail("");
    setFormPassword("");
    setFormRol("");
    setFormError("");
  }

  function openEdit(u: ApiUsuario) {
    setFormMode("edit");
    setEditingUser(u);
    setFormNombre(u.nombre);
    setFormEmail(u.email);
    setFormPassword("");
    setFormRol(u.rol ? String(u.rol.id) : "");
    setFormError("");
  }

  function closeForm() {
    setFormMode(null);
    setEditingUser(null);
    setFormError("");
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (formMode === "edit") {
      // Editar pide confirmación antes de aplicar el cambio, igual que en
      // Propuestas/Noticias/Comunicados.
      setPendingUpdate({ nombre: formNombre, email: formEmail, rol: formRol ? Number(formRol) : null });
      return;
    }

    void performCreate();
  }

  async function performCreate() {
    setFormSubmitting(true);
    try {
      // La respuesta de /register/ trae tokens de la cuenta recién creada — se descartan
      // a propósito, si no se pisaría la sesión del administrador que la está creando.
      const result = await withAuth((access) =>
        register(access, {
          nombre: formNombre,
          email: formEmail,
          password: formPassword,
          rol: formRol ? Number(formRol) : undefined,
        }),
      );
      setUsuarios((prev) => [result.usuario, ...prev]);
      closeForm();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo crear el usuario.");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleConfirmUpdate() {
    if (!editingUser || !pendingUpdate) return;
    setFormSubmitting(true);
    try {
      const updated = await withAuth((access) => updateUsuario(access, editingUser.id, pendingUpdate));
      setUsuarios((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setPendingUpdate(null);
      closeForm();
    } catch (err) {
      setPendingUpdate(null);
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleteError("");
    setDeletingId(pendingDelete.id);
    try {
      const updated = await withAuth((access) => deleteUsuario(access, pendingDelete.id));
      setUsuarios((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "No se pudo eliminar. Intenta de nuevo.");
      setPendingDelete(null);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleReactivate(u: ApiUsuario) {
    setReactivateError("");
    setReactivatingId(u.id);
    try {
      const updated = await withAuth((access) => updateUsuario(access, u.id, { estado: true }));
      setUsuarios((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    } catch (err) {
      setReactivateError(err instanceof ApiError ? err.message : "No se pudo reactivar. Intenta de nuevo.");
    } finally {
      setReactivatingId(null);
    }
  }

  function openReset(u: ApiUsuario) {
    setResetTarget(u);
    setResetPasswordValue("");
    setResetError("");
  }

  function closeReset() {
    setResetTarget(null);
    setResetPasswordValue("");
    setResetError("");
  }

  function handleResetSubmit(e: FormEvent) {
    e.preventDefault();
    setResetError("");
    if (resetPasswordValue.length < 8) {
      setResetError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setPendingReset(true);
  }

  async function handleConfirmReset() {
    if (!resetTarget) return;
    setResetSubmitting(true);
    try {
      await withAuth((access) => resetUsuarioPassword(access, resetTarget.id, { password_nuevo: resetPasswordValue }));
      setPendingReset(false);
      closeReset();
    } catch (err) {
      setPendingReset(false);
      setResetError(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña. Intenta de nuevo.");
    } finally {
      setResetSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand-gray-900">Usuarios</h2>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
          >
            <UserPlus size={15} /> Nuevo usuario
          </button>
        </div>

        <div className="mt-6">
          {loading && <p className="text-sm text-brand-gray-900/50">Cargando usuarios…</p>}
          {loadError && <p className="text-sm text-red-600">{loadError}</p>}
          {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
          {reactivateError && <p className="text-sm text-red-600">{reactivateError}</p>}
          {!loading && !loadError && usuarios.length === 0 && (
            <p className="rounded-xl border border-dashed border-brand-gray-900/15 p-6 text-center text-sm text-brand-gray-900/50">
              Todavía no hay usuarios.
            </p>
          )}
          {!loading && !loadError && usuarios.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-brand-gray-900/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-gray-900/10 bg-brand-gray-50">
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Nombre
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Correo
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Estado
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Staff
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Rol
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => {
                    const isSelf = u.id === currentUsuario.id;
                    return (
                      <tr key={u.id} className="border-b border-brand-gray-900/10 last:border-b-0 hover:bg-brand-gray-50/60">
                        <td className="max-w-[12rem] truncate px-4 py-3 font-semibold text-brand-gray-900">
                          {u.nombre}
                          {isSelf && <span className="ml-1.5 text-xs font-normal text-brand-gray-900/40">(tú)</span>}
                        </td>
                        <td className="max-w-[16rem] truncate px-4 py-3 text-brand-gray-900/70">{u.email}</td>
                        <td className="px-4 py-3">
                          <EstadoBadge activo={u.estado} />
                        </td>
                        <td className="px-4 py-3">
                          {u.is_staff ? (
                            <span className="rounded-full bg-brand-gray-900/5 px-2.5 py-0.5 text-xs font-medium text-brand-gray-900/50">
                              Staff
                            </span>
                          ) : (
                            <span className="text-brand-gray-900/30">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              u.rol?.nombre === "Administrador"
                                ? "bg-brand-yellow/20 text-brand-gray-900/70"
                                : "bg-brand-gray-900/5 text-brand-gray-900/50"
                            }`}
                          >
                            {u.rol?.nombre ?? "Sin rol"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(u)}
                              aria-label="Editar"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark"
                            >
                              <Pencil size={15} />
                            </button>
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => openReset(u)}
                                aria-label="Resetear contraseña"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark"
                              >
                                <KeyRound size={15} />
                              </button>
                            )}
                            {!isSelf &&
                              (u.estado ? (
                                <button
                                  type="button"
                                  onClick={() => setPendingDelete(u)}
                                  disabled={deletingId === u.id}
                                  aria-label="Eliminar"
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                                >
                                  <Trash2 size={15} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleReactivate(u)}
                                  disabled={reactivatingId === u.id}
                                  aria-label="Reactivar"
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark disabled:opacity-60"
                                >
                                  <RotateCcw size={15} />
                                </button>
                              ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: crear / editar usuario */}
      {createPortal(
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-gray-900/60 px-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeForm}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={formTitleId}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md rounded-2xl bg-white p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 id={formTitleId} className="font-display text-lg font-bold text-brand-gray-900">
                    {formMode === "edit" ? "Editar usuario" : "Nuevo usuario"}
                  </h3>
                  <button
                    type="button"
                    onClick={closeForm}
                    aria-label="Cerrar"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/40 transition-colors hover:bg-brand-gray-50 hover:text-brand-gray-900"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <div ref={formBodyRef} className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                        Nombre
                      </label>
                      <input
                        type="text"
                        required
                        value={formNombre}
                        onChange={(e) => setFormNombre(e.target.value)}
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
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
                      />
                    </div>
                    {formMode === "create" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                          Contraseña
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={formPassword}
                          onChange={(e) => setFormPassword(e.target.value)}
                          className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
                        />
                      </div>
                    )}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                        Rol (opcional)
                      </label>
                      <select
                        value={formRol}
                        onChange={(e) => setFormRol(e.target.value)}
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
                  </div>

                  {formError && <p className="text-sm text-red-600">{formError}</p>}

                  <div className="mt-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
                    >
                      {formSubmitting ? "Guardando…" : formMode === "edit" ? "Guardar cambios" : "Crear"}
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      disabled={formSubmitting}
                      className="rounded-full border border-brand-gray-900/15 px-5 py-2.5 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:bg-white disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Modal: resetear contraseña de otro usuario */}
      {createPortal(
        <AnimatePresence>
          {resetTarget && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-gray-900/60 px-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeReset}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={resetTitleId}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm rounded-2xl bg-white p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 id={resetTitleId} className="font-display text-lg font-bold text-brand-gray-900">
                    Resetear contraseña
                  </h3>
                  <button
                    type="button"
                    onClick={closeReset}
                    aria-label="Cerrar"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/40 transition-colors hover:bg-brand-gray-50 hover:text-brand-gray-900"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="mb-4 text-sm text-brand-gray-900/60">
                  Nueva contraseña para <span className="font-semibold text-brand-gray-900">{resetTarget.nombre}</span> (
                  {resetTarget.email}).
                </p>

                <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Nueva contraseña
                    </label>
                    <input
                      ref={resetFieldRef}
                      type="password"
                      required
                      minLength={8}
                      value={resetPasswordValue}
                      onChange={(e) => setResetPasswordValue(e.target.value)}
                      className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
                    />
                  </div>

                  {resetError && <p className="text-sm text-red-600">{resetError}</p>}

                  <div className="mt-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={resetSubmitting}
                      className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={closeReset}
                      disabled={resetSubmitting}
                      className="rounded-full border border-brand-gray-900/15 px-5 py-2.5 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:bg-white disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <ConfirmDialog
        open={pendingUpdate !== null}
        title="Guardar cambios"
        message={`¿Guardar los cambios en "${formNombre}"?`}
        confirmLabel="Guardar"
        confirming={formSubmitting}
        onConfirm={handleConfirmUpdate}
        onCancel={() => setPendingUpdate(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar usuario"
        message={`¿Eliminar a "${pendingDelete?.nombre ?? ""}"? Va a quedar inactivo y no va a poder iniciar sesión hasta que lo reactives.`}
        confirmLabel="Eliminar"
        confirming={pendingDelete !== null && deletingId === pendingDelete.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={pendingReset}
        title="Resetear contraseña"
        message={`¿Cambiar la contraseña de "${resetTarget?.nombre ?? ""}"? Va a dejar de poder usar su contraseña anterior de inmediato.`}
        confirmLabel="Cambiar contraseña"
        confirming={resetSubmitting}
        onConfirm={handleConfirmReset}
        onCancel={() => setPendingReset(false)}
      />
    </div>
  );
}
