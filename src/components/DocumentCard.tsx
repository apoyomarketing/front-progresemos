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

export default function DocumentCard({ doc, index }: { doc: DocumentEntry; index: number }) {
  const Icon = iconMap[doc.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-between rounded-2xl border border-brand-gray-900/10 bg-white p-7 transition-colors duration-300 hover:border-brand-green/40"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gray-50 text-brand-green-dark">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <div className="mt-8">
        <h3 className="font-display text-lg font-bold text-brand-gray-900">{doc.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray-900/60">{doc.description}</p>
      </div>
    </motion.div>
  );
}
