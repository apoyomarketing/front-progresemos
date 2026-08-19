import SectionHeader from "./SectionHeader";
import DocumentCard from "./DocumentCard";
import { documents } from "../data/documents";

export default function Documents() {
  return (
    <section id="transparencia" className="bg-brand-gray-50 py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="Agenda 2030"
          title="Nuestro compromiso con los Objetivos de Desarrollo Sostenible"
          description="Alineamos nuestro plan de gobierno con la Agenda 2030 de las Naciones Unidas para construir una Puno más justa, sostenible y con oportunidades para todos."
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
