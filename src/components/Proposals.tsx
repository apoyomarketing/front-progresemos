import SectionHeader from "./SectionHeader";
import ProposalCard from "./ProposalCard";
import { proposals } from "../data/proposals";

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
          {proposals.map((proposal) => (
            <ProposalCard proposal={proposal} key={proposal.number} />
          ))}
        </div>
      </div>
    </section>
  );
}
