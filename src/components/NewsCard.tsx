import { motion } from "framer-motion";
import PhotoPlaceholder from "./PhotoPlaceholder";
import type { ApiNoticia } from "../api/content";
import { isVideoSrc } from "../lib/media";
import { formatFecha } from "../lib/date";

export default function NewsCard({
  item,
  index,
  featured = false,
  onClick,
}: {
  item: ApiNoticia;
  index: number;
  featured?: boolean;
  onClick?: () => void;
}) {
  const hasMedia = Boolean(item.multimedia);
  const isVideo = hasMedia && isVideoSrc(item.multimedia);

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="group cursor-pointer"
        onClick={onClick}
      >
        <div className="overflow-hidden rounded-2xl bg-brand-green/10">
          {hasMedia ? (
            isVideo ? (
              <video
                src={item.multimedia}
                muted
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <img
                src={item.multimedia}
                alt={item.titulo}
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            )
          ) : (
            <PhotoPlaceholder
              label={item.titulo}
              tone="green"
              className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          )}
        </div>
        <div className="mt-6 flex items-center gap-3 text-sm">
          {item.categoria && (
            <span className="rounded-full bg-brand-green/10 px-3 py-1 font-semibold text-brand-green-dark">
              {item.categoria}
            </span>
          )}
          <span className="text-brand-gray-900/45">{formatFecha(item.fecha)}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-brand-gray-900 transition-colors group-hover:text-brand-green-dark sm:text-3xl">
          {item.titulo}
        </h3>
        <p className="mt-3 max-w-2xl text-brand-gray-900/65 leading-relaxed">{item.descripcion}</p>
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
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="w-28 shrink-0 overflow-hidden rounded-xl bg-brand-green/10 sm:w-32">
          {hasMedia ? (
            isVideo ? (
              <video
                src={item.multimedia}
                muted
                className="aspect-square w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
              />
            ) : (
              <img
                src={item.multimedia}
                alt={item.titulo}
                className="aspect-square w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
              />
            )
          ) : (
            <PhotoPlaceholder
              label={item.titulo}
              tone="lime"
              className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.05]"
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs">
            {item.categoria && (
              <span className="font-semibold uppercase tracking-wide text-brand-green-dark">
                {item.categoria}
              </span>
            )}
            <span className="text-brand-gray-900/40">· {formatFecha(item.fecha)}</span>
          </div>
          <h4 className="mt-2 font-display text-base font-bold leading-snug text-brand-gray-900 transition-colors group-hover:text-brand-green-dark">
            {item.titulo}
          </h4>
        </div>
      </div>
    </motion.article>
  );
}
