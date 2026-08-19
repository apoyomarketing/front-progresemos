import { motion } from "framer-motion";
import PhotoPlaceholder from "./PhotoPlaceholder";
import type { Proposal } from "../data/proposals";
import caminataAquino from "../assets/nosotros.png";
import mitinNoche2 from "../assets/campana-mitin-noche-2.jpg";
import mitinDiaEscenario from "../assets/campana-mitin-dia-escenario.jpg";

const realPhotos: Record<string, string> = {
  "01": caminataAquino,
  "02": mitinNoche2,
  "03": mitinDiaEscenario,
};

export default function ProposalCard({ proposal }: { proposal: Proposal }) {
  const imageFirst = proposal.imageSide === "left";
  const realImage = realPhotos[proposal.number];

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, x: imageFirst ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={imageFirst ? "lg:order-1" : "lg:order-2"}
      >
        {realImage ? (
          <img
            src={realImage}
            alt={proposal.photo}
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        ) : (
          <PhotoPlaceholder
            label={proposal.photo}
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
          <span className="font-display text-lg font-bold text-brand-green-dark">
            {proposal.number}
          </span>
          <span className="eyebrow text-brand-gray-900/50">{proposal.category}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-brand-gray-900 sm:text-3xl lg:text-4xl">
          {proposal.title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-brand-gray-900/70 sm:text-lg">
          {proposal.description}
        </p>
      </motion.div>
    </div>
  );
}
