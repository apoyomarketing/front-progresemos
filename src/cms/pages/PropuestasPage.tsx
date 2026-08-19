import { propuestasApi } from "../../api/content";
import type { ApiPropuesta } from "../../api/content";
import { useAuth } from "../../api/AuthProvider";
import { useApiCollection } from "../useApiCollection";
import CollectionManager from "../CollectionManager";
import type { FieldConfig } from "../CollectionManager";

const proposalFields: FieldConfig<ApiPropuesta>[] = [
  { key: "titulo", label: "Título", type: "text" },
  { key: "foto", label: "Foto", type: "image" },
  { key: "descripcion", label: "Descripción", type: "textarea" },
];

export default function PropuestasPage() {
  const { withAuth } = useAuth();
  const proposals = useApiCollection(propuestasApi, withAuth);

  if (proposals.loading) return <p className="text-sm text-brand-gray-900/50">Cargando propuestas…</p>;
  if (proposals.loadError) return <p className="text-sm text-red-600">{proposals.loadError}</p>;

  return (
    <CollectionManager
      title="Propuestas"
      emptyLabel="Todavía no hay propuestas."
      fields={proposalFields}
      titleKey="titulo"
      items={proposals.items}
      onCreate={proposals.create}
      onUpdate={proposals.update}
      onDelete={proposals.remove}
    />
  );
}
