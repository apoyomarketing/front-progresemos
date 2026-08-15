import SectionHeader from "./SectionHeader";
import StatCounter from "./StatCounter";
import { stats } from "../data/stats";

export default function ImpactStats() {
  return (
    <section className="bg-brand-gray-50 py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="Alcance provincial"
          title="Una visión que conecta distritos y oportunidades"
        />

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCounter key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        <p className="mt-14 max-w-xl text-sm text-brand-gray-900/50">
          Cifras demostrativas y editables del proyecto. No representan datos
          oficiales verificados.
        </p>
      </div>
    </section>
  );
}
