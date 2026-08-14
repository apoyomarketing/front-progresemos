import { ShieldCheck, Heart, Building2, FileText } from "lucide-react";
import Reveal from "./Reveal.jsx";

const CARDS = [
  { icon: ShieldCheck, label: "Transparencia" },
  { icon: Heart, label: "Valores" },
  { icon: Building2, label: "Organización" },
  { icon: FileText, label: "Documentos" },
];

export default function About() {
  return (
    <section id="partido" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div className="w-14 h-1 bg-verde-lima rounded-full mb-6" />
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave mb-5">
            Conoce Progresemos
          </h2>
          <p className="text-gristexto leading-relaxed mb-4">
            Progresemos presenta una visión política orientada al desarrollo, la participación
            ciudadana y la construcción de propuestas para el futuro.
          </p>
          <p className="text-gristexto leading-relaxed">
            Esta sección es un espacio institucional editable: aquí puede incorporarse la
            historia, la misión y la visión de la organización.
          </p>
        </Reveal>

        <Reveal delay={120} className="grid grid-cols-2 gap-4">
          {CARDS.map((c) => (
            <div
              key={c.label}
              className="bg-grisclaro rounded-2xl p-6 flex flex-col items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all contour-light"
            >
              <span className="text-verde-oscuro">
                <c.icon size={24} strokeWidth={1.8} />
              </span>
              <span className="font-display font-bold text-negrosuave text-sm">{c.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
