import { noticiasApi } from "../../api/content";
import type { ApiNoticia } from "../../api/content";
import { useAuth } from "../../api/AuthProvider";
import { useApiCollection } from "../useApiCollection";
import CollectionManager from "../CollectionManager";
import type { FieldConfig } from "../CollectionManager";

const newsFields: FieldConfig<ApiNoticia>[] = [
  { key: "titulo", label: "Título", type: "text" },
  { key: "foto", label: "Foto", type: "image" },
  { key: "video", label: "URL de video (opcional)", type: "text" },
  { key: "descripcion", label: "Descripción", type: "textarea" },
  { key: "fecha", label: "Fecha", type: "date" },
  { key: "lugar", label: "Lugar", type: "text" },
];

export default function NoticiasPage() {
  const { withAuth } = useAuth();
  const news = useApiCollection(noticiasApi, withAuth);

  if (news.loading) return <p className="text-sm text-brand-gray-900/50">Cargando noticias…</p>;
  if (news.loadError) return <p className="text-sm text-red-600">{news.loadError}</p>;

  return (
    <CollectionManager
      title="Noticias"
      emptyLabel="Todavía no hay noticias."
      fields={newsFields}
      titleKey="titulo"
      items={news.items}
      onCreate={news.create}
      onUpdate={news.update}
      onDelete={news.remove}
    />
  );
}
