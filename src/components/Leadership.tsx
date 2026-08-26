import SectionHeader from "./SectionHeader";
import ProfileCard from "./ProfileCard";
import ContourMotif from "./ContourMotif";
import { leadership } from "../data/leadership";

export default function Leadership() {
  return (
    <section
      id="candidatos"
      className="relative overflow-hidden bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-dark py-24 sm:py-32"
    >
      <ContourMotif className="pointer-events-none absolute inset-x-0 top-0 h-20 w-full text-white/10" />

      <div className="container-editorial relative">
        <SectionHeader
          eyebrow="04 — Candidatos"
          title="Personas que hacen posible el cambio"
          description="La fórmula de PROGRESEMOS para la Provincia de Puno, elecciones municipales 2026."
          light
        />

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:max-w-3xl">
          {leadership.map((profile, i) => (
            <ProfileCard profile={profile} index={i} key={profile.name + i} />
          ))}
        </div>
      </div>
    </section>
  );
}
