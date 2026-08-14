import { FileText, Download } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { documents } from "../data/documents.js";

export default function Transparency() {
  return (
    <section id="documentos" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-14">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave mb-3">
            Transparencia
          </h2>
          <p className="text-gristexto">
            Documentos institucionales. Archivos placeholder — reemplazar antes de publicar.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {documents.map((d, i) => (
            <Reveal
              key={d.id}
              delay={i * 80}
              className="flex items-center gap-4 border border-grisclaro rounded-2xl p-5 hover:border-verde-principal/30 hover:shadow-sm transition-all"
            >
              <span className="w-11 h-11 shrink-0 rounded-xl bg-verde-principal/10 text-verde-oscuro flex items-center justify-center">
                <FileText size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gristexto">{d.category}</p>
                <p className="font-display font-bold text-negrosuave text-sm truncate">{d.name}</p>
              </div>
              <a
                href={d.url}
                className="shrink-0 text-verde-oscuro hover:text-verde-profundo focus-ring rounded"
                aria-label={`Descargar ${d.name}`}
              >
                <Download size={20} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
