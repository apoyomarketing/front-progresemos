import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ContourMotif from "./ContourMotif";
import { candidatosCompletos, type CandidatoCompleto } from "../data/candidatosCompletos";

interface CandidatoConFoto extends CandidatoCompleto {
  photo: string;
}

const conFoto = candidatosCompletos.filter((c): c is CandidatoConFoto => c.photo !== null);

export default function Leadership() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function desplazar(direccion: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const tarjeta = el.querySelector<HTMLElement>("[data-tarjeta]");
    const paso = tarjeta ? tarjeta.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direccion * paso, behavior: "smooth" });
  }

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

        <div className="relative mt-16">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {conFoto.map((candidato, i) => (
              <motion.div
                key={candidato.dni}
                data-tarjeta
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[22%]"
              >
                <Link to="/candidatos" className="group block">
                  <div className="overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-white/15 transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45)]">
                    <img
                      src={candidato.photo}
                      alt={`Candidato de PROGRESEMOS: ${candidato.nombre}`}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-display text-sm font-bold leading-tight text-white sm:text-base">
                      {candidato.nombre}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-lime">
                      {candidato.cargo}
                      {candidato.numeroLista !== null ? ` · N° ${candidato.numeroLista}` : ""}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => desplazar(-1)}
            aria-label="Ver candidatos anteriores"
            className="absolute left-1 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-gray-900 shadow-md transition-colors hover:bg-white sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => desplazar(1)}
            aria-label="Ver más candidatos"
            className="absolute right-1 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-gray-900 shadow-md transition-colors hover:bg-white sm:flex"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/candidatos"
            className="text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            Ver todos los candidatos y su hoja de vida →
          </Link>
        </div>
      </div>
    </section>
  );
}
