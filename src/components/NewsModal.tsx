import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Calendar, Tag } from "lucide-react";
import type { ApiNoticia } from "../api/content";
import { isVideoSrc } from "../lib/media";
import { formatFecha } from "../lib/date";

interface NewsModalProps {
  open: boolean;
  item: ApiNoticia | null;
  onClose: () => void;
}

export default function NewsModal({ open, item, onClose }: NewsModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Si no hay item, pero el componente sigue montado (por la animación de salida),
  // necesitamos retener la estructura, por lo que podemos usar un 'div' vacío
  // pero lo normal es que item se limpie solo después de la animación si fuera posible.
  // Aquí la AnimatePresence envuelve el open && item, así que está bien.

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-brand-gray-900/60 px-4 py-6 backdrop-blur-sm sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-brand-gray-900/10 p-4 sm:px-6 sm:py-4">
              <h2 id={titleId} className="font-display text-lg font-bold text-brand-gray-900">
                Detalle de Noticia
              </h2>
              <button
                ref={closeRef}
                onClick={onClose}
                className="rounded-full bg-brand-gray-50 p-2 text-brand-gray-900/60 transition-colors hover:bg-brand-gray-100 hover:text-brand-gray-900"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 lg:p-8">
              {item.multimedia && (
                <div className="mb-8 overflow-hidden rounded-xl bg-brand-green/10">
                  {isVideoSrc(item.multimedia) ? (
                    <video
                      src={item.multimedia}
                      controls
                      autoPlay
                      muted
                      className="w-full max-h-[50vh] object-contain"
                    />
                  ) : (
                    <img
                      src={item.multimedia}
                      alt={item.titulo}
                      className="w-full max-h-[50vh] object-contain"
                    />
                  )}
                </div>
              )}

              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-brand-gray-900/60">
                {item.categoria && (
                  <span className="flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1 font-semibold text-brand-green-dark">
                    <Tag size={14} />
                    {item.categoria}
                  </span>
                )}
                {item.fecha && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatFecha(item.fecha)}
                  </span>
                )}
                {item.lugar && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {item.lugar}
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl font-bold leading-tight text-brand-gray-900 sm:text-3xl lg:text-4xl">
                {item.titulo}
              </h3>

              <div className="mt-6 text-base leading-relaxed text-brand-gray-900/80 whitespace-pre-wrap">
                {item.descripcion}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
