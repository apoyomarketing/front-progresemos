import { useEffect } from "react";

interface DocumentHeadOptions {
  title: string;
  description?: string;
  robots?: string;
}

function upsertMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  const existed = !!el;
  const previousContent = el?.getAttribute("content") ?? null;

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);

  return function restore() {
    if (!existed) {
      el?.remove();
    } else if (previousContent !== null) {
      el?.setAttribute("content", previousContent);
    }
  };
}

// Vite ahora sirve un único index.html para toda la SPA, así que el <title>/meta
// por ruta (antes uno distinto por cada .html) se actualiza en el cliente al montar
// cada página, y se restaura al desmontar para no "ensuciar" otra ruta.
export function useDocumentHead({ title, description, robots }: DocumentHeadOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const restores: Array<() => void> = [];
    if (description) restores.push(upsertMeta("description", description));
    if (robots) restores.push(upsertMeta("robots", robots));

    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore());
    };
  }, [title, description, robots]);
}
