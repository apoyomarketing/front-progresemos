import { useEffect, useState } from "react";
import { ApiError } from "../api/client";
import type { ContentFields } from "../api/content";
import type { WithAuth } from "../api/useAuthSession";

interface ContentApi<T> {
  list: () => Promise<T[]>;
  create: (access: string, fields: ContentFields) => Promise<T>;
  update: (access: string, id: number, fields: ContentFields) => Promise<T>;
  remove: (access: string, id: number) => Promise<void>;
}

export function useApiCollection<T extends { id: number }>(api: ContentApi<T>, withAuth: WithAuth) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .list()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function create(fields: ContentFields) {
    const created = await withAuth((access) => api.create(access, fields));
    setItems((prev) => [created, ...prev]);
  }

  async function update(id: number, fields: ContentFields) {
    const updated = await withAuth((access) => api.update(access, id, fields));
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
  }

  async function remove(id: number) {
    await withAuth((access) => api.remove(access, id));
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return { items, loading, loadError, create, update, remove };
}
