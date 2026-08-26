import SectionHeader from "./SectionHeader";
import DocumentCard from "./DocumentCard";
import ContourMotif from "./ContourMotif";
import { documents } from "../data/documents";

// Numeración oficial de los Objetivos de Desarrollo Sostenible de la ONU,
// en el mismo orden que las entradas de `documents`.
const SDG_NUMBERS = ["01", "02", "03", "04", "08", "11"];

export default function Documents() {
  return (
    <section id="transparencia" className="relative overflow-hidden bg-brand-gray-50 py-24 sm:py-32">
      <ContourMotif className="pointer-events-none absolute inset-x-0 top-0 h-14 w-full text-brand-green/10" />

      <div className="container-editorial relative">
        <SectionHeader
          eyebrow="08 — Agenda 2030"
          title="Nuestro compromiso con los Objetivos de Desarrollo Sostenible"
          description="Alineamos nuestro plan de gobierno con la Agenda 2030 de las Naciones Unidas para construir una Puno más justa, sostenible y con oportunidades para todos."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, i) => (
            <DocumentCard doc={doc} index={i} sdgNumber={SDG_NUMBERS[i] ?? String(i + 1).padStart(2, "0")} key={doc.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
