import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { news, newsCategories } from "../data/news.js";

export default function News({ compact = false }) {
  const [filter, setFilter] = useState("Todas");
  const cats = ["Todas", ...newsCategories];
  const filtered = filter === "Todas" ? news : news.filter((n) => n.category === filter);

  return (
    <section id="noticias" className={`${compact ? "py-16" : "py-20 md:py-28"} bg-grisclaro`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave mb-2">
              Noticias y actualidad
            </h2>
            <p className="text-gristexto">Contenido de ejemplo.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors focus-ring ${
                  filter === c ? "bg-verde-principal text-white" : "bg-white text-gristexto hover:bg-verde-principal/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((n, i) => (
            <Reveal
              key={n.id}
              delay={i * 100}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <div className="h-36 bg-gradient-to-br from-verde-principal to-verde-profundo" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="text-verde-oscuro font-semibold bg-verde-principal/10 px-2 py-0.5 rounded-full">
                    {n.category}
                  </span>
                  <span className="text-gristexto">{n.date}</span>
                </div>
                <h3 className="font-display font-bold text-negrosuave mb-2">{n.title}</h3>
                <p className="text-sm text-gristexto mb-4">{n.summary}</p>
                <button className="text-sm font-semibold text-verde-oscuro inline-flex items-center gap-1 hover:gap-2 transition-all focus-ring rounded">
                  Leer noticia <ArrowRight size={15} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
