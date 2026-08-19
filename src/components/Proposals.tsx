import SectionHeader from "./SectionHeader";
import ProposalCard from "./ProposalCard";
import Button from "./Button";
import { proposals } from "../data/proposals";

const featuredProposals = proposals.slice(0, 3);

export default function Proposals() {
  return (
    <section id="propuestas" className="bg-white py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="Propuestas"
          title="Propuestas para transformar el Perú"
          description="Iniciativas concretas construidas desde el diálogo con la ciudadanía y las regiones."
        />

        <div className="mt-20 flex flex-col gap-24 sm:gap-32">
          {featuredProposals.map((proposal) => (
            <ProposalCard proposal={proposal} key={proposal.number} />
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Button href="/propuestas.html" target="_blank" rel="noopener noreferrer" variant="secondary">
            Ver más propuestas
          </Button>
        </div>
      </div>
    </section>
  );
}
