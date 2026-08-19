import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "../data/heroSlides";

const SLIDE_DURATION = 5000;
const DEFAULT_OVERLAY = "bg-gradient-to-t from-brand-gray-900/85 via-brand-gray-900/40 to-brand-gray-900/20";

export default function HeroCarousel({
  slides,
  overlayClassName = DEFAULT_OVERLAY,
  onIndexChange,
}: {
  slides: HeroSlide[];
  overlayClassName?: string;
  onIndexChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasMultiple = slides.length > 1;

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!hasMultiple || paused) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasMultiple, paused, slides.length]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={index}
          src={slides[index].image}
          alt={slides[index].alt}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className={`absolute inset-0 ${overlayClassName}`} />

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Imagen anterior"
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente imagen"
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
