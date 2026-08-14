import { ShieldCheck, Target, Users, FileText } from "lucide-react";
import Reveal from "./Reveal.jsx";

const ITEMS = [
  { icon: ShieldCheck, title: "Principios", sub: "Transparencia · Desarrollo · Participación" },
  { icon: Target, title: "Propuestas", sub: "Información organizada por áreas" },
  { icon: Users, title: "Equipo", sub: "Personas y representantes" },
  { icon: FileText, title: "Documentos", sub: "Información institucional" },
];

export default function InfoBar() {
  return (
    <section className="bg-white border-b border-grisclaro">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={i * 80} className="flex items-start gap-3">
            <span className="text-verde-principal shrink-0">
              <it.icon size={22} strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-display font-bold text-negrosuave text-sm">{it.title}</p>
              <p className="text-xs text-gristexto mt-0.5">{it.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
