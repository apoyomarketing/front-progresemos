import SectionHeader from "./SectionHeader";
import ProfileCard from "./ProfileCard";
import { leadership } from "../data/leadership";

export default function Leadership() {
  return (
    <section id="candidatos" className="bg-brand-gray-50 py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="Candidatos"
          title="Personas que hacen posible el cambio"
          description="La fórmula de PROGRESEMOS para la Provincia de Puno, elecciones municipales 2026."
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
