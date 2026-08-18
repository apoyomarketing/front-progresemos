import { motion } from "framer-motion";
import ContourMotif from "./ContourMotif";
import Button from "./Button";
import capachicaNoche from "../assets/capachica-plaza-noche.jpg";

const highlights = ["Altiplano", "Cultura viva", "Producción agrícola", "Turismo", "Juventud puneña"];

export default function PunoSection() {
  return (
    <section className="relative overflow-hidden bg-brand-gray-900 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img
          src={capachicaNoche}
          alt="Plaza de Capachica de noche, provincia de Puno"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gray-900 via-brand-gray-900/70 to-transparent" />
      </motion.div>

      <ContourMotif className="pointer-events-none absolute inset-x-0 top-0 h-20 w-full text-white/10" />

      <div className="container-editorial relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <span className="eyebrow mb-6 block text-brand-lime">Identidad regional</span>
          <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Desde Puno, hacia un futuro con más oportunidades
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75">
            El altiplano es cuna de historia, cultura y trabajo. Desde ahí construimos
            una visión que une identidad y modernidad, con propuestas que impulsan el
            desarrollo de cada comunidad puneña.
          </p>

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

          <div className="mt-10">
            <Button href="#propuestas" variant="light">
              Ver propuestas para Puno
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
