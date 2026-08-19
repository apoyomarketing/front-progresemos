import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2, Plus, Video, ImageOff, X } from "lucide-react";
import { ApiError } from "../api/client";
import type { ContentFields } from "../api/content";
import { isVideoSrc } from "../lib/media";
import ConfirmDialog from "./ConfirmDialog";

export type FieldType = "text" | "email" | "password" | "date" | "textarea" | "image" | "media";

export interface FieldConfig<T> {
  key: keyof T & string;
  label: string;
  type: FieldType;
  required?: boolean;
}

interface CollectionManagerProps<T extends { id: number }> {
  title: string;
  emptyLabel: string;
  fields: FieldConfig<T>[];
  titleKey: keyof T & string;
  items: T[];
  onCreate: (fields: ContentFields) => Promise<void>;
  onUpdate: (id: number, fields: ContentFields) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function emptyDraft<T>(fields: FieldConfig<T>[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, ""]));
}

export default function CollectionManager<T extends { id: number }>({
  title,
  emptyLabel,
  fields,
  titleKey,
  items,
  onCreate,
  onUpdate,
  onDelete,
}: CollectionManagerProps<T>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>(() => emptyDraft(fields));
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const [pendingUpdate, setPendingUpdate] = useState<ContentFields | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);

  const mediaField = fields.find((f) => f.type === "image" || f.type === "media");
  const columnFields = fields.filter((f) => f !== mediaField);
  const isFormOpen = creating || editingId !== null;
  const formTitleId = useId();
  const formBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFormOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstField = formBodyRef.current?.querySelector<HTMLElement>("input, textarea");
    firstField?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") cancel();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpen]);

  function startCreate() {
    setDraft(emptyDraft(fields));
    setMediaFile(null);
    setFormError("");
    setCreating(true);
    setEditingId(null);
  }

  function startEdit(item: T) {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      next[f.key] = String(item[f.key] ?? "");
    });
    setDraft(next);
    setMediaFile(null);
    setFormError("");
    setEditingId(item.id);
    setCreating(false);
  }

  function cancel() {
    setCreating(false);
    setEditingId(null);
    setFormError("");
  }

  function handleFile(key: string, file: File) {
    setMediaFile(file);
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, [key]: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function buildFieldsToSend(): ContentFields {
    const fieldsToSend: ContentFields = {};
    fields.forEach((f) => {
      if (mediaField && f.key === mediaField.key) return;
      fieldsToSend[f.key] = draft[f.key] ?? "";
    });

    // Sin selector de URL: si no se eligió un archivo nuevo, no se manda nada
    // — al crear queda sin archivo (si no es obligatorio) y al editar la API
    // conserva el que ya tenía.
    if (mediaField && mediaFile) {
      fieldsToSend[mediaField.key] = mediaFile;
    }

    return fieldsToSend;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (mediaField?.required && creating && !mediaFile) {
      setFormError(`${mediaField.label} es obligatorio.`);
      return;
    }

    const fieldsToSend = buildFieldsToSend();

    if (editingId !== null) {
      // Editar pide confirmación antes de aplicar el cambio.
      setPendingUpdate(fieldsToSend);
      return;
    }

    void performCreate(fieldsToSend);
  }

  async function performCreate(fieldsToSend: ContentFields) {
    setSubmitting(true);
    try {
      await onCreate(fieldsToSend);
      cancel();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmUpdate() {
    if (editingId === null || pendingUpdate === null) return;
    setSubmitting(true);
    try {
      await onUpdate(editingId, pendingUpdate);
      setPendingUpdate(null);
      cancel();
    } catch (err) {
      setPendingUpdate(null);
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setDeleteError("");
    setDeletingId(id);
    try {
      await onDelete(id);
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "No se pudo eliminar. Intenta de nuevo.");
      setPendingDelete(null);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-brand-gray-900">{title}</h2>
        {!isFormOpen && (
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
          >
            <Plus size={15} /> Nuevo
          </button>
        )}
      </div>

      {deleteError && <p className="mt-4 text-sm text-red-600">{deleteError}</p>}

      {items.length === 0 && !isFormOpen ? (
        <p className="mt-6 rounded-xl border border-dashed border-brand-gray-900/15 p-6 text-center text-sm text-brand-gray-900/50">
          {emptyLabel}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-brand-gray-900/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-gray-900/10 bg-brand-gray-50">
                {mediaField && <th className="w-16 px-4 py-3" />}
                {columnFields.map((f) => (
                  <th
                    key={f.key}
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50"
                  >
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const mediaValue = mediaField ? String(item[mediaField.key] ?? "") : "";
                return (
                  <tr key={item.id} className="border-b border-brand-gray-900/10 last:border-b-0 hover:bg-brand-gray-50/60">
                    {mediaField && (
                      <td className="px-4 py-3">
                        {mediaValue ? (
                          isVideoSrc(mediaValue) ? (
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gray-900/5 text-brand-gray-900/40">
                              <Video size={16} />
                            </span>
                          ) : (
                            <img src={mediaValue} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          )
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gray-900/5 text-brand-gray-900/30">
                            <ImageOff size={16} />
                          </span>
                        )}
                      </td>
                    )}
                    {columnFields.map((f) => (
                      <td key={f.key} className="max-w-[16rem] truncate px-4 py-3 text-brand-gray-900/80">
                        {String(item[f.key] ?? "") || "—"}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          aria-label="Editar"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(item)}
                          disabled={deletingId === item.id}
                          aria-label="Eliminar"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
              onClick={cancel}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={formTitleId}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 id={formTitleId} className="font-display text-lg font-bold text-brand-gray-900">
                    {editingId !== null ? "Editar" : "Nuevo"}
                  </h3>
                  <button
                    type="button"
                    onClick={cancel}
                    aria-label="Cerrar"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/40 transition-colors hover:bg-brand-gray-50 hover:text-brand-gray-900"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div ref={formBodyRef} className="flex flex-col gap-4">
                    {fields.map((f) => (
                      <div key={f.key}>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                          {f.label}
                          {f.required && <span className="text-red-500"> *</span>}
                        </label>

                        {f.type === "textarea" ? (
                          <textarea
                            value={draft[f.key] ?? ""}
                            onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                            required={f.required}
                            rows={3}
                            className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
                          />
                        ) : f.type === "image" || f.type === "media" ? (
                          <div className="flex flex-col gap-2">
                            {draft[f.key] &&
                              (isVideoSrc(draft[f.key]) ? (
                                <video
                                  src={draft[f.key]}
                                  controls
                                  muted
                                  className="h-28 w-44 rounded-lg bg-black object-cover"
                                />
                              ) : (
                                <img src={draft[f.key]} alt="" className="h-28 w-44 rounded-lg object-cover" />
                              ))}
                            <input
                              type="file"
                              accept={f.type === "media" ? "image/*,video/*" : "image/*"}
                              onChange={(e) => e.target.files?.[0] && handleFile(f.key, e.target.files[0])}
                              className="text-sm text-brand-gray-900/70"
                            />
                          </div>
                        ) : (
                          <input
                            type={f.type}
                            value={draft[f.key] ?? ""}
                            onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                            required={f.required}
                            className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {formError && <p className="text-sm text-red-600">{formError}</p>}

                  <div className="mt-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
                    >
                      {submitting ? "Guardando…" : editingId !== null ? "Guardar cambios" : "Crear"}
                    </button>
                    <button
                      type="button"
                      onClick={cancel}
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
        message={`¿Guardar los cambios en "${draft[titleKey] ?? ""}"?`}
        confirmLabel="Guardar"
        confirming={submitting}
        onConfirm={handleConfirmUpdate}
        onCancel={() => setPendingUpdate(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar"
        message={`¿Eliminar "${pendingDelete ? String(pendingDelete[titleKey]) : ""}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirming={pendingDelete !== null && deletingId === pendingDelete.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
