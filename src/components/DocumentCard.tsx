import { motion } from "framer-motion";
import {
  FileText,
  FolderOpen,
  Megaphone,
  ClipboardList,
  Scale,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import type { DocumentEntry } from "../data/documents";

const iconMap: Record<DocumentEntry["icon"], typeof FileText> = {
  "file-text": FileText,
  "folder-open": FolderOpen,
  megaphone: Megaphone,
  "clipboard-list": ClipboardList,
  scale: Scale,
  "building-2": Building2,
};

export default function DocumentCard({ doc, index }: { doc: DocumentEntry; index: number }) {
  const Icon = iconMap[doc.icon];

  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col justify-between rounded-2xl border border-brand-gray-900/10 bg-white p-7 transition-colors duration-300 hover:border-brand-green/40"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gray-50 text-brand-green-dark">
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <ArrowUpRight
          size={18}
          className="text-brand-gray-900/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-green"
        />
      </div>
      <div className="mt-8">
        <h3 className="font-display text-lg font-bold text-brand-gray-900">{doc.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray-900/60">{doc.description}</p>
      </div>
    </motion.a>
  );
}
