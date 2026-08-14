import * as Icons from "lucide-react";
import Reveal from "./Reveal.jsx";
import { principles } from "../data/principles.js";

export default function Principles() {
  return (
    <section className="py-20 md:py-28 bg-grisclaro">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mx-auto text-center mb-14" as="div">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave mb-3">
            Nuestros principios
          </h2>
          <p className="text-gristexto">Los ejes que orientan la organización y sus propuestas.</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, i) => {
            const IconComp = Icons[p.icon] || Icons.Circle;
            return (
              <Reveal
                key={p.title}
                delay={(i % 3) * 100}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <span className="inline-flex w-11 h-11 rounded-xl bg-verde-principal/10 text-verde-oscuro items-center justify-center mb-4">
                  <IconComp size={22} strokeWidth={1.8} />
                </span>
                <h3 className="font-display font-bold text-lg text-negrosuave mb-2">{p.title}</h3>
                <p className="text-sm text-gristexto leading-relaxed">{p.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
