import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import ContourMotif from "./ContourMotif";
import { leadership } from "../data/leadership";

export default function Leadership() {
  return (
    <section
      id="candidatos"
      className="relative overflow-hidden bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-dark py-24 sm:py-32"
    >
      <ContourMotif className="pointer-events-none absolute inset-x-0 top-0 h-20 w-full text-white/10" />

      <div className="container-editorial relative">
        <SectionHeader
          eyebrow="04 — Candidatos"
          title="Personas que hacen posible el cambio"
          description="La fórmula de PROGRESEMOS para la Provincia de Puno, elecciones municipales 2026."
          light
        />

        <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {leadership.map((candidato, i) => (
            <motion.div
              key={candidato.orden}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-white/15 transition-shadow duration-500 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45)]"
            >
              <img
                src={candidato.photo}
                alt={`Candidato de PROGRESEMOS: ${candidato.nombre}`}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
