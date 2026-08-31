import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Ban, RotateCcw, ClipboardCheck, X } from "lucide-react";
import { useAuth } from "../../api/AuthProvider";
import { ApiError } from "../../api/client";
import {
  listActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  ESTADOS_ACTIVIDAD,
  type ApiActividad,
  type ActividadPayload,
} from "../../api/actividades";
import ConfirmDialog from "../ConfirmDialog";

function EstadoBadge({ estado }: { estado: string }) {
  const cancelada = estado === "cancelado";
  const label = ESTADOS_ACTIVIDAD.find((e) => e.value === estado)?.label ?? estado ?? "—";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        cancelada ? "bg-brand-gray-900/10 text-brand-gray-900/50" : "bg-brand-green/10 text-brand-green-dark"
      }`}
    >
      {label}
    </span>
  );
}

const emptyForm: ActividadPayload = {
  nombre: "",
  fecha: "",
  lugar: "",
  tipo: "",
  descripcion: "",
  estado: "programado",
};

export default function ActividadesPage() {
  const { withAuth } = useAuth();

  const [items, setItems] = useState<ApiActividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ActividadPayload>(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<ActividadPayload | null>(null);
  const formTitleId = useId();
  const formBodyRef = useRef<HTMLDivElement>(null);

  const [pendingCancel, setPendingCancel] = useState<ApiActividad | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [reactivatingId, setReactivatingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;
    withAuth(listActividades)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar las actividades.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
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
    formBodyRef.current?.querySelector<HTMLElement>("input, textarea")?.focus();

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

  function openCreate() {
    setFormMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function openEdit(actividad: ApiActividad) {
    setFormMode("edit");
    setEditingId(actividad.id);
    setForm({
      nombre: actividad.nombre,
      fecha: actividad.fecha,
      lugar: actividad.lugar,
      tipo: actividad.tipo,
      descripcion: actividad.descripcion,
      estado: actividad.estado,
    });
    setFormError("");
  }

  function closeForm() {
    setFormMode(null);
    setEditingId(null);
    setFormError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (formMode === "edit") {
      setPendingUpdate(form);
      return;
    }

    void performCreate();
  }

  async function performCreate() {
    setSubmitting(true);
    try {
      const created = await withAuth((access) => crearActividad(access, form));
      setItems((prev) => [created, ...prev]);
      closeForm();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo crear la actividad.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmUpdate() {
    if (editingId === null || pendingUpdate === null) return;
    setSubmitting(true);
    try {
      const updated = await withAuth((access) => actualizarActividad(access, editingId, pendingUpdate));
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      setPendingUpdate(null);
      closeForm();
    } catch (err) {
      setPendingUpdate(null);
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmCancel() {
    if (!pendingCancel) return;
    setActionError("");
    setCancelingId(pendingCancel.id);
    try {
      const updated = await withAuth((access) => eliminarActividad(access, pendingCancel.id));
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      setPendingCancel(null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "No se pudo cancelar. Intenta de nuevo.");
      setPendingCancel(null);
    } finally {
      setCancelingId(null);
    }
  }

  async function handleReactivate(actividad: ApiActividad) {
    setActionError("");
    setReactivatingId(actividad.id);
    try {
      const updated = await withAuth((access) =>
        actualizarActividad(access, actividad.id, { estado: "programado" }),
      );
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "No se pudo reactivar. Intenta de nuevo.");
    } finally {
      setReactivatingId(null);
    }
  }

  const claseInput =
    "w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green";
  const claseLabel = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50";

  if (loading) return <p className="text-sm text-brand-gray-900/50">Cargando actividades…</p>;
  if (loadError) return <p className="text-sm text-red-600">{loadError}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-brand-gray-900">Actividades</h2>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
        >
          <Plus size={15} /> Nueva actividad
        </button>
      </div>

      {actionError && <p className="mt-4 text-sm text-red-600">{actionError}</p>}

      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-brand-gray-900/15 p-6 text-center text-sm text-brand-gray-900/50">
          Todavía no hay actividades. Crea una para poder pasar asistencia.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-gray-900/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-gray-900/10 bg-brand-gray-50">
                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                  Nombre
                </th>
                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                  Tipo
                </th>
                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                  Fecha
                </th>
                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                  Lugar
                </th>
                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                  Estado
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((actividad) => (
                <tr
                  key={actividad.id}
                  className="border-b border-brand-gray-900/10 last:border-b-0 even:bg-brand-gray-50/40 hover:bg-brand-gray-50"
                >
                  <td className="max-w-[16rem] truncate px-5 py-3.5 font-semibold text-brand-gray-900">
                    {actividad.nombre}
                  </td>
                  <td className="px-5 py-3.5 text-brand-gray-900/70">{actividad.tipo || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-brand-gray-900/70">{actividad.fecha || "—"}</td>
                  <td className="max-w-[14rem] truncate px-5 py-3.5 text-brand-gray-900/70">
                    {actividad.lugar || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <EstadoBadge estado={actividad.estado} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      {actividad.estado !== "cancelado" && (
                        <Link
                          to={`/admin/actividades/${actividad.id}/asistencia`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-brand-gray-900/15 px-3 py-1.5 text-xs font-semibold text-brand-gray-900/70 transition-colors hover:border-brand-green hover:text-brand-green-dark"
                        >
                          <ClipboardCheck size={14} /> Llamar asistencia
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => openEdit(actividad)}
                        aria-label="Editar"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark"
                      >
                        <Pencil size={15} />
                      </button>
                      {actividad.estado === "cancelado" ? (
                        <button
                          type="button"
                          onClick={() => handleReactivate(actividad)}
                          disabled={reactivatingId === actividad.id}
                          aria-label="Reactivar"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark disabled:opacity-60"
                        >
                          <RotateCcw size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingCancel(actividad)}
                          disabled={cancelingId === actividad.id}
                          aria-label="Cancelar"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                        >
                          <Ban size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 id={formTitleId} className="font-display text-lg font-bold text-brand-gray-900">
                    {formMode === "edit" ? "Editar actividad" : "Nueva actividad"}
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div ref={formBodyRef} className="flex flex-col gap-4">
                    <div>
                      <label className={claseLabel}>Nombre</label>
                      <input
                        type="text"
                        required
                        value={form.nombre}
                        onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                        className={claseInput}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={claseLabel}>Fecha</label>
                        <input
                          type="date"
                          required
                          value={form.fecha}
                          onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                          className={claseInput}
                        />
                      </div>
                      <div>
                        <label className={claseLabel}>Tipo</label>
                        <input
                          type="text"
                          value={form.tipo}
                          onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                          className={claseInput}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={claseLabel}>Lugar</label>
                      <input
                        type="text"
                        required
                        value={form.lugar}
                        onChange={(e) => setForm((f) => ({ ...f, lugar: e.target.value }))}
                        className={claseInput}
                      />
                    </div>
                    <div>
                      <label className={claseLabel}>Descripción</label>
                      <textarea
                        rows={3}
                        value={form.descripcion}
                        onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                        className={claseInput}
                      />
                    </div>
                    <div>
                      <label className={claseLabel}>Estado</label>
                      <select
                        value={form.estado}
                        onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
                        className={claseInput}
                      >
                        {ESTADOS_ACTIVIDAD.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {formError && <p className="text-sm text-red-600">{formError}</p>}

                  <div className="mt-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
                    >
                      {submitting ? "Guardando…" : formMode === "edit" ? "Guardar cambios" : "Crear"}
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      disabled={submitting}
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
        message={`¿Guardar los cambios en "${form.nombre}"?`}
        confirmLabel="Guardar"
        confirming={submitting}
        onConfirm={handleConfirmUpdate}
        onCancel={() => setPendingUpdate(null)}
      />

      <ConfirmDialog
        open={pendingCancel !== null}
        title="Cancelar actividad"
        message={`¿Cancelar "${pendingCancel?.nombre ?? ""}"? Va a quedar marcada como cancelada y no vas a poder pasar asistencia nueva ahí hasta reactivarla.`}
        confirmLabel="Cancelar actividad"
        confirming={pendingCancel !== null && cancelingId === pendingCancel.id}
        onConfirm={handleConfirmCancel}
        onCancel={() => setPendingCancel(null)}
      />
    </div>
  );
}
