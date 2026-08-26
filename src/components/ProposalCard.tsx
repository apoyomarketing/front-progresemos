import { motion } from "framer-motion";
import PhotoPlaceholder from "./PhotoPlaceholder";
import type { ApiPropuesta } from "../api/content";

export default function ProposalCard({ proposal, index }: { proposal: ApiPropuesta; index: number }) {
  const imageFirst = index % 2 === 0;
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, x: imageFirst ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={imageFirst ? "lg:order-1" : "lg:order-2"}
      >
        {proposal.foto ? (
          <img
            src={proposal.foto}
            alt={proposal.titulo}
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        ) : (
          <PhotoPlaceholder
            label={proposal.titulo}
            tone={imageFirst ? "green" : "lime"}
            className="aspect-[4/3] w-full rounded-2xl"
          />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={imageFirst ? "lg:order-2" : "lg:order-1"}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green font-display text-sm font-bold text-white">
            {number}
          </span>
          {proposal.categoria && (
            <span className="rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/70">
              {proposal.categoria}
            </span>
          )}
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-brand-gray-900 sm:text-3xl lg:text-4xl">
          {proposal.titulo}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-brand-gray-900/70 sm:text-lg">
          {proposal.descripcion}
        </p>
      </motion.div>
    </div>
  );
}
