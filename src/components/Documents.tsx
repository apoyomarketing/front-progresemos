import SectionHeader from "./SectionHeader";
import DocumentCard from "./DocumentCard";
import { documents } from "../data/documents";

export default function Documents() {
  return (
    <section id="transparencia" className="bg-brand-gray-50 py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="Institucionalidad"
          title="Transparencia e información pública"
          description="Acceso claro y ordenado a los documentos que rigen nuestra vida institucional."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, i) => (
            <DocumentCard doc={doc} index={i} key={doc.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
