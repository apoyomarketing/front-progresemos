import Reveal from "./Reveal.jsx";
import { candidate } from "../data/candidate.js";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] flex items-center overflow-hidden contour-bg"
      style={{
        background:
          "linear-gradient(135deg, #075B2B 0%, #087A38 45%, #159447 75%, #65C91A 130%)",
      }}
    >
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-verde-lima/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-white/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-28 pb-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <Reveal>
          <span className="inline-block text-verde-lima font-semibold tracking-widest text-xs md:text-sm uppercase mb-4">
            Progresemos
          </span>
          <h1 className="font-display font-extrabold text-white text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Una propuesta
            <br />
            para avanzar
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-md mb-8 leading-relaxed">
            Conoce nuestras ideas, principios, propuestas y el equipo que representa a Progresemos.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/propuestas"
              className="bg-white text-verde-profundo font-semibold px-6 py-3.5 rounded-full hover:bg-verde-lima transition-colors focus-ring"
            >
              Conocer propuestas
            </a>
            <a
              href="/candidato"
              className="border border-white/40 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-white/10 transition-colors focus-ring"
            >
              Conocer al candidato
            </a>
          </div>
        </Reveal>

        <Reveal delay={150} className="relative flex justify-center md:justify-end">
          <div className="relative w-64 h-80 md:w-80 md:h-[26rem]">
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-verde-lima/40 to-white/10 blur-2xl" />
            <div className="relative w-full h-full rounded-[3rem] bg-white/10 border border-white/20 backdrop-blur-sm flex flex-col items-center justify-end overflow-hidden">
              {candidate.photo ? (
                <img
                  src={candidate.photo}
                  alt={`Fotografía de ${candidate.name}`}
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white/20 border-2 border-white/40 mt-10 flex items-center justify-center text-white/70 text-xs text-center px-4">
                  Foto del
                  <br />
                  candidato
                </div>
              )}
              <div className="w-full bg-verde-profundo/70 text-white text-center py-5 mt-8 relative">
                <p className="font-display font-extrabold tracking-wide uppercase">{candidate.name}</p>
                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">{candidate.role}</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full border border-verde-lima/50" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border border-white/20" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
