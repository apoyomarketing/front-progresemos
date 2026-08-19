import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContourMotif from "./ContourMotif";
import HeroCarousel from "./HeroCarousel";
import { punoSlides } from "../data/punoSlides";

const highlights = ["Altiplano", "Cultura viva", "Producción agrícola", "Turismo", "Juventud puneña"];

export default function PunoSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = punoSlides[activeIndex];

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-brand-gray-900 py-24 sm:min-h-[85vh] sm:py-32 lg:min-h-screen">
      <HeroCarousel
        slides={punoSlides}
        onIndexChange={setActiveIndex}
        overlayClassName="bg-gradient-to-r from-brand-gray-900 via-brand-gray-900/70 to-transparent"
      />

      <ContourMotif className="pointer-events-none absolute inset-x-0 top-0 h-20 w-full text-white/10" />

      <div className="container-editorial relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <span className="eyebrow mb-6 block text-brand-lime">Identidad provincial</span>
          <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Desde Puno, hacia un futuro con más oportunidades
          </h2>

          <AnimatePresence mode="wait">
            <motion.p
              key={activeSlide.district}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg leading-relaxed text-white/75"
            >
              <span className="mb-1 block text-sm font-semibold uppercase tracking-wide text-brand-lime">
                {activeSlide.district}
              </span>
              {activeSlide.phrase}
            </motion.p>
          </AnimatePresence>

          <ul className="mt-9 flex flex-wrap gap-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
