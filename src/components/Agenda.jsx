import { Calendar, Clock, MapPin } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { agenda } from "../data/agenda.js";

export default function Agenda() {
  return (
    <section id="agenda" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-14">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave mb-3">
            Agenda
          </h2>
          <p className="text-gristexto">Próximas actividades. Fechas de ejemplo, sujetas a confirmación.</p>
        </Reveal>

        <div className="relative md:pl-8">
          <div className="hidden md:block absolute left-2 top-2 bottom-2 w-px bg-verde-principal/20" />
          <div className="space-y-8">
            {agenda.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 100} className="relative md:pl-10">
                <span className="hidden md:flex absolute left-[-2.05rem] top-1.5 w-4 h-4 rounded-full bg-verde-principal ring-4 ring-white" />
                <div className="bg-grisclaro rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="shrink-0 flex md:flex-col gap-2 md:gap-1 text-verde-oscuro">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <Calendar size={16} /> {ev.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm">
                      <Clock size={16} /> {ev.time}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-negrosuave">{ev.title}</h3>
                    <p className="text-sm text-gristexto flex items-center gap-1.5 mt-1">
                      <span className="text-verde-principal">
                        <MapPin size={14} />
                      </span>
                      {ev.place}
                    </p>
                  </div>
                  <button className="shrink-0 text-sm font-semibold text-verde-oscuro hover:underline focus-ring rounded">
                    Ver detalles
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
