import { comunicadosApi } from "../../api/content";
import type { ApiComunicado } from "../../api/content";
import { useAuth } from "../../api/AuthProvider";
import { useApiCollection } from "../useApiCollection";
import CollectionManager from "../CollectionManager";
import type { FieldConfig } from "../CollectionManager";

const comunicadoFields: FieldConfig<ApiComunicado>[] = [
  { key: "titulo", label: "Título", type: "text" },
  { key: "foto", label: "Foto", type: "image" },
  { key: "video", label: "URL de video (opcional)", type: "text" },
];

export default function ComunicadosPage() {
  const { withAuth } = useAuth();
  const comunicados = useApiCollection(comunicadosApi, withAuth);

  if (comunicados.loading) return <p className="text-sm text-brand-gray-900/50">Cargando comunicados…</p>;
  if (comunicados.loadError) return <p className="text-sm text-red-600">{comunicados.loadError}</p>;

  return (
    <CollectionManager
      title="Comunicados"
      emptyLabel="Todavía no hay comunicados."
      fields={comunicadoFields}
      titleKey="titulo"
      items={comunicados.items}
      onCreate={comunicados.create}
      onUpdate={comunicados.update}
      onDelete={comunicados.remove}
    />
  );
}
