import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProposalCard from "./components/ProposalCard";
import { propuestasApi } from "./api/content";
import { usePublicCollection } from "./hooks/usePublicCollection";
import { useDocumentHead } from "./hooks/useDocumentHead";

export default function AllProposals() {
  useDocumentHead({
    title: "Todas nuestras propuestas — PROGRESEMOS Puno 2026",
    description:
      "Conoce todas las propuestas de PROGRESEMOS para la Provincia de Puno: educación, salud, agricultura y más ejes de desarrollo.",
  });

  const { items: proposals, loading, failed } = usePublicCollection(propuestasApi.list);

  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar solid />

      <main className="pb-24 pt-32 sm:pb-32 sm:pt-40">
        <div className="container-editorial">
          <span className="eyebrow mb-6 block text-brand-green">Propuestas</span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-gray-900 sm:text-5xl lg:text-6xl">
            Todas nuestras propuestas
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray-900/70">
            Iniciativas concretas construidas desde el diálogo con la ciudadanía y las regiones,
            para transformar la provincia de Puno.
          </p>

          <div className="mt-20 flex flex-col gap-24 sm:gap-32">
            {loading && (
              <p className="text-sm text-brand-gray-900/50" aria-hidden="true">
                Cargando propuestas…
              </p>
            )}
            {!loading && failed && (
              <p className="text-sm text-brand-gray-900/50">
                No pudimos cargar las propuestas. Intenta de nuevo más tarde.
              </p>
            )}
            {!loading &&
              !failed &&
              proposals.map((proposal, i) => <ProposalCard proposal={proposal} index={i} key={proposal.id} />)}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
