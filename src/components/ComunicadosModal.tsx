import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { comunicadosApi } from "../api/content";
import type { ApiComunicado } from "../api/content";
import { isVideoSrc } from "../lib/media";

const DISMISS_KEY = "progresemos_comunicado_visto";
const SHOW_DELAY_MS = 700;
const SLIDE_DURATION = 7000;

export default function ComunicadosModal() {
  const [items, setItems] = useState<ApiComunicado[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const hasMultiple = items.length > 1;

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    comunicadosApi
      .list()
      .then((data) => {
        if (cancelled) return;
        // El modal es solo visual (foto/video) — un comunicado sin multimedia
        // no tiene nada que mostrar acá.
        const withMedia = data.filter((c) => c.multimedia);
        if (withMedia.length === 0) return;
        setItems(withMedia);

        const lastSeenId = sessionStorage.getItem(DISMISS_KEY);
        if (lastSeenId === String(withMedia[0].id)) return;

        timer = setTimeout(() => {
          if (!cancelled) setOpen(true);
        }, SHOW_DELAY_MS);
      })
      .catch(() => {
        // Modal opcional: si falla la carga, simplemente no aparece.
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const goTo = useCallback(
    (i: number) => setIndex(((i % items.length) + items.length) % items.length),
    [items.length],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!open || !hasMultiple || paused) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, hasMultiple, paused, items.length]);

  function close() {
    setOpen(false);
    if (items[0]) sessionStorage.setItem(DISMISS_KEY, String(items[0].id));
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const current = items[Math.min(index, items.length - 1)];

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-gray-900/80 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Comunicado oficial"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
            >
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex max-h-[90vh] items-center justify-center"
              >
                {isVideoSrc(current.multimedia) ? (
                  <video
                    src={current.multimedia}
                    controls
                    autoPlay
                    muted
                    className="max-h-[90vh] w-full object-contain"
                  />
                ) : (
                  <img
                    src={current.multimedia}
                    alt=""
                    className="max-h-[90vh] w-full object-contain"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Comunicado anterior"
                  className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Siguiente comunicado"
                  className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
                  {items.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Ir al comunicado ${i + 1}`}
                      aria-current={i === index}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-7 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
