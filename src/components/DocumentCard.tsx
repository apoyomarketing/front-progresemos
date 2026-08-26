import { motion } from "framer-motion";
import { HandCoins, Wheat, HeartPulse, GraduationCap, Briefcase, Building2 } from "lucide-react";
import type { DocumentEntry } from "../data/documents";

const iconMap: Record<DocumentEntry["icon"], typeof HandCoins> = {
  "hand-coins": HandCoins,
  wheat: Wheat,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  "building-2": Building2,
};

const accents = [
  "bg-brand-green text-white",
  "bg-brand-lime text-brand-gray-900",
  "bg-brand-yellow text-brand-gray-900",
  "bg-brand-green-dark text-white",
];

export default function DocumentCard({
  doc,
  index,
  sdgNumber,
}: {
  doc: DocumentEntry;
  index: number;
  sdgNumber: string;
}) {
  const Icon = iconMap[doc.icon];
  const accent = accents[index % accents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-gray-900/10 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_40px_-16px_rgba(23,107,36,0.28)]"
    >
      <span
        className="pointer-events-none absolute -right-3 -top-5 font-display text-7xl font-extrabold text-brand-gray-900/[0.04] transition-colors duration-300 group-hover:text-brand-green/[0.06]"
        aria-hidden="true"
      >
        {sdgNumber}
      </span>

      <div className="relative flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
          <Icon size={21} strokeWidth={1.75} />
        </span>
        <span className="eyebrow mt-1 text-brand-gray-900/35">ODS {sdgNumber}</span>
      </div>

      <div className="relative mt-8">
        <h3 className="font-display text-lg font-bold leading-snug text-brand-gray-900">{doc.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray-900/60">{doc.description}</p>
      </div>
    </motion.div>
  );
}
