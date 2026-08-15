import { motion } from "framer-motion";
import PhotoPlaceholder from "./PhotoPlaceholder";
import type { NewsItem } from "../data/news";
import reunionFlyer from "../assets/flyer-reunion-coordinacion.png";
import presentacionFlyer from "../assets/flyer-presentacion-candidatos.png";

const images: Record<string, string> = {
  reunion: reunionFlyer,
  presentacion: presentacionFlyer,
};

export default function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const realImage = item.image ? images[item.image] : undefined;

  if (item.featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="group cursor-pointer"
      >
        <div className="overflow-hidden rounded-2xl bg-brand-green/10">
          {realImage ? (
            <img
              src={realImage}
              alt={item.title}
              className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <PhotoPlaceholder
              label={item.photo}
              tone="green"
              className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          )}
        </div>
        <div className="mt-6 flex items-center gap-3 text-sm">
          <span className="rounded-full bg-brand-green/10 px-3 py-1 font-semibold text-brand-green-dark">
            {item.category}
          </span>
          <span className="text-brand-gray-900/45">{item.date}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-brand-gray-900 transition-colors group-hover:text-brand-green-dark sm:text-3xl">
          {item.title}
        </h3>
        <p className="mt-3 max-w-2xl text-brand-gray-900/65 leading-relaxed">{item.excerpt}</p>
        <span className="mt-4 inline-block text-sm font-semibold text-brand-green-dark underline-offset-4 group-hover:underline">
          Leer más
        </span>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer border-t border-brand-gray-900/10 pt-6 first:border-t-0 first:pt-0"
    >
      <div className="flex gap-4">
        <div className="w-28 shrink-0 overflow-hidden rounded-xl bg-brand-green/10 sm:w-32">
          {realImage ? (
            <img
              src={realImage}
              alt={item.title}
              className="aspect-square w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <PhotoPlaceholder
              label={item.photo}
              tone="lime"
              className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.05]"
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wide text-brand-green-dark">
              {item.category}
            </span>
            <span className="text-brand-gray-900/40">· {item.date}</span>
          </div>
          <h4 className="mt-2 font-display text-base font-bold leading-snug text-brand-gray-900 transition-colors group-hover:text-brand-green-dark">
            {item.title}
          </h4>
        </div>
      </div>
    </motion.article>
  );
}
