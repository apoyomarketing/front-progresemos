import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { candidate } from "../data/candidate.js";

export default function Candidate() {
  const tabKeys = Object.keys(candidate.tabs);
  const [tab, setTab] = useState(tabKeys[0]);

  return (
    <section id="candidato" className="py-20 md:py-28 bg-grisclaro">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14 items-center">
        <Reveal className="flex justify-center">
          <div className="relative w-72 h-96">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-verde-principal to-verde-profundo opacity-10 blur-2xl" />
            <div className="relative w-full h-full rounded-[2.5rem] bg-white border border-verde-principal/15 shadow-lg flex items-center justify-center overflow-hidden">
              {candidate.photo ? (
                <img
                  src={candidate.photo}
                  alt={`Fotografía de ${candidate.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-grisclaro border-2 border-dashed border-verde-principal/40 flex items-center justify-center text-center text-xs text-gristexto px-4">
                  Fotografía del candidato (reemplazar)
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave">
            {candidate.name}
          </h2>
          <p className="text-verde-oscuro font-semibold uppercase tracking-widest text-xs mt-2 mb-5">
            {candidate.role}
          </p>
          <p className="text-gristexto leading-relaxed mb-6">{candidate.bio}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {tabKeys.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring ${
                  tab === t ? "bg-verde-principal text-white" : "bg-white text-gristexto hover:bg-verde-principal/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <p className="text-sm text-gristexto bg-white rounded-xl p-5 mb-6 border border-grisclaro">
            {candidate.tabs[tab]}
          </p>

          <a
            href="/candidato"
            className="inline-flex items-center gap-1.5 bg-verde-principal hover:bg-verde-oscuro text-white font-semibold px-6 py-3 rounded-full transition-colors focus-ring"
          >
            Ver perfil completo <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
