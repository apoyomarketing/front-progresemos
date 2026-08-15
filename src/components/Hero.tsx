import { motion } from "framer-motion";
import Button from "./Button";
import ContourMotif from "./ContourMotif";
import HeroCarousel from "./HeroCarousel";
import { heroSlides } from "../data/heroSlides";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[70vh] items-end overflow-hidden bg-brand-gray-900 sm:min-h-[85vh] lg:min-h-screen"
    >
      <HeroCarousel slides={heroSlides} />

      <div className="container-editorial relative z-10 w-full pb-16 pt-40 sm:pb-28 sm:pt-48">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="eyebrow mb-6 inline-block text-brand-lime"
          >
            PROGRESEMOS — Puno 2026
          </motion.span>

          <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {["PUNO SEGURO,", "MODERNO Y", "PRODUCTIVO"].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="block overflow-hidden"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-8 max-w-lg text-lg leading-relaxed text-white/85 sm:text-xl"
          >
            Lucio Istaña, candidato a la Alcaldía Provincial de Puno. Un equipo
            comprometido con el desarrollo de cada distrito.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button href="#propuestas" variant="primary">
              Conoce nuestras propuestas
            </Button>
            <Button href="#candidatos" variant="ghost">
              Conoce al candidato
            </Button>
          </motion.div>
        </div>
      </div>

      <ContourMotif className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 w-full text-brand-lime/30 sm:h-24" />
    </section>
  );
}
