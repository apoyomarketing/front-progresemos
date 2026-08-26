import SectionHeader from "./SectionHeader";
import ProposalCard from "./ProposalCard";
import Button from "./Button";
import { propuestasApi } from "../api/content";
import { usePublicCollection } from "../hooks/usePublicCollection";

function ProposalsSkeleton() {
  return (
    <div className="mt-20 flex flex-col gap-24 sm:gap-32" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-brand-gray-50" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-24 animate-pulse rounded-full bg-brand-gray-50" />
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-brand-gray-50" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-brand-gray-50" />
            <div className="h-4 w-2/3 animate-pulse rounded-lg bg-brand-gray-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Proposals() {
  const { items, loading, failed } = usePublicCollection(propuestasApi.list);
  const featuredProposals = items.slice(0, 3);

  if (!loading && (failed || featuredProposals.length === 0)) return null;

  return (
    <section id="propuestas" className="bg-white py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="02 — Propuestas"
          title="Propuestas para transformar el Perú"
          description="Iniciativas concretas construidas desde el diálogo con la ciudadanía y las regiones."
        />

        {loading ? (
          <ProposalsSkeleton />
        ) : (
          <div className="mt-20 flex flex-col gap-24 sm:gap-32">
            {featuredProposals.map((proposal, i) => (
              <ProposalCard proposal={proposal} index={i} key={proposal.id} />
            ))}
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <Button to="/propuestas" variant="secondary">
            Ver más propuestas
          </Button>
        </div>
      </div>
    </section>
  );
}
