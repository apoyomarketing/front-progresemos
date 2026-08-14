import { useState } from "react";
import {
  GraduationCap, Cross, Coins, Building2, Siren, Leaf, Cpu, Map, ArrowRight,
} from "lucide-react";
import Reveal from "./Reveal.jsx";
import { categories, proposals } from "../data/proposals.js";

const CATEGORY_ICON = {
  "Educación": GraduationCap,
  "Salud": Cross,
  "Economía": Coins,
  "Infraestructura": Building2,
  "Seguridad": Siren,
  "Medio ambiente": Leaf,
  "Tecnología": Cpu,
  "Desarrollo regional": Map,
};

export default function Proposals({ compact = false }) {
  const [active, setActive] = useState(categories[0]);
  const filtered = proposals.filter((p) => p.category === active);

  return (
    <section id="propuestas" className={compact ? "py-16" : "py-20 md:py-28"}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave mb-3">
            Propuestas
          </h2>
          <p className="text-gristexto">
            Contenido de ejemplo — reemplazar con las propuestas reales antes de publicar.
          </p>
        </Reveal>

        <Reveal className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const IconComp = CATEGORY_ICON[cat];
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring ${
                  active === cat
                    ? "bg-verde-principal text-white"
                    : "bg-grisclaro text-gristexto hover:bg-verde-principal/10"
                }`}
              >
                <IconComp size={16} /> {cat}
              </button>
            );
          })}
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((p) => (
            <Reveal
              key={p.id}
              className="border border-grisclaro rounded-2xl p-6 hover:shadow-md hover:border-verde-principal/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-verde-oscuro bg-verde-principal/10 px-2.5 py-1 rounded-full">
                  {p.id}
                </span>
                <span className="text-xs text-gristexto">{p.category}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-negrosuave mb-2">{p.title}</h3>
              <p className="text-sm text-gristexto mb-4">{p.description}</p>
              <button className="text-sm font-semibold text-verde-oscuro inline-flex items-center gap-1 hover:gap-2 transition-all focus-ring rounded">
                Ver detalle <ArrowRight size={15} />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
