import { useEffect, useState } from "react";

// Versión de solo lectura de useApiCollection (src/cms/useApiCollection.ts) para
// el lado público: no necesita `withAuth` porque nunca escribe. Si la API falla,
// `failed` se pone en true y el llamador oculta la sección en silencio — un
// error de red no debe mostrarle un mensaje feo a un votante.
export function usePublicCollection<T>(list: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    list()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, failed };
}
