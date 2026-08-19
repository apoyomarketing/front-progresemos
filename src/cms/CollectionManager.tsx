import { useState, type FormEvent } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ApiError } from "../api/client";
import type { ContentFields } from "../api/content";

export type FieldType = "text" | "email" | "password" | "date" | "textarea" | "image";

export interface FieldConfig<T> {
  key: keyof T & string;
  label: string;
  type: FieldType;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const imageField = fields.find((f) => f.type === "image");
  const isFormOpen = creating || editingId !== null;

  function startCreate() {
    setDraft(emptyDraft(fields));
    setImageFile(null);
    setOriginalImage("");
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
    setImageFile(null);
    setOriginalImage(imageField ? String(item[imageField.key] ?? "") : "");
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
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, [key]: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function handleImageUrlChange(key: string, value: string) {
    setImageFile(null);
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    const fieldsToSend: ContentFields = {};
    fields.forEach((f) => {
      if (imageField && f.key === imageField.key) return;
      fieldsToSend[f.key] = draft[f.key] ?? "";
    });

    if (imageField) {
      if (imageFile) {
        fieldsToSend[imageField.key] = imageFile;
      } else if (creating) {
        if (draft[imageField.key]) fieldsToSend[imageField.key] = draft[imageField.key];
      } else if (draft[imageField.key] !== originalImage) {
        fieldsToSend[imageField.key] = draft[imageField.key];
      }
    }

    setSubmitting(true);
    try {
      if (editingId !== null) {
        await onUpdate(editingId, fieldsToSend);
      } else {
        await onCreate(fieldsToSend);
      }
      cancel();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteError("");
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "No se pudo eliminar. Intenta de nuevo.");
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

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 rounded-xl border border-brand-gray-900/10 bg-brand-gray-50 p-5"
        >
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                {f.label}
              </label>

              {f.type === "textarea" ? (
                <textarea
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
                />
              ) : f.type === "image" ? (
                <div className="flex flex-col gap-2">
                  {draft[f.key] && (
                    <img src={draft[f.key]} alt="" className="h-28 w-44 rounded-lg object-cover" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(f.key, e.target.files[0])}
                    className="text-sm text-brand-gray-900/70"
                  />
                  <input
                    type="text"
                    placeholder="o pega una URL de imagen"
                    value={draft[f.key]?.startsWith("data:") ? "" : draft[f.key] ?? ""}
                    onChange={(e) => handleImageUrlChange(f.key, e.target.value)}
                    className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
                  />
                </div>
              ) : (
                <input
                  type={f.type}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
                />
              )}
            </div>
          ))}

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
      )}

      {deleteError && <p className="mt-4 text-sm text-red-600">{deleteError}</p>}

      <ul className="mt-6 flex flex-col gap-3">
        {items.length === 0 && !isFormOpen && (
          <li className="rounded-xl border border-dashed border-brand-gray-900/15 p-6 text-center text-sm text-brand-gray-900/50">
            {emptyLabel}
          </li>
        )}
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-brand-gray-900/10 p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              {imageField && item[imageField.key] && (
                <img
                  src={String(item[imageField.key])}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              )}
              <span className="truncate text-sm font-semibold text-brand-gray-900">
                {String(item[titleKey])}
              </span>
            </div>
            <div className="flex shrink-0 gap-2">
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
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                aria-label="Eliminar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
