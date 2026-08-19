import cercaniaComunidad from "../assets/nosotros.png";
import progresemosLogo from "../assets/progresemos-logo.png";

export default function About() {
  return (
    <section id="nosotros" className="bg-white py-24 sm:py-32">
      <div className="container-editorial grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <span className="eyebrow mb-6 block text-brand-green">01 — Nuestra visión</span>
          <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-brand-gray-900 sm:text-4xl lg:text-5xl">
            Un nuevo camino para Puno
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-brand-gray-900/70">
            PROGRESEMOS es la organización política que impulsa la candidatura de
            Lucio Istaña a la Alcaldía Provincial de Puno, con propuestas concretas,
            participación ciudadana e institucionalidad al servicio de cada distrito.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-brand-gray-900/70">
            Aspiramos a construir una provincia competitiva, inclusiva y sostenible,
            reconocida por la calidad de vida de su población, el dinamismo de su
            economía, la protección de su riqueza natural y cultural —especialmente
            el Lago Titicaca— y la eficiencia de sus instituciones públicas.
          </p>
        </div>

        <div className="relative lg:col-span-7">
          <img
            src={cercaniaComunidad}
            alt="Lucio Istaña saludando a vecinos en una comunidad de la provincia de Puno"
            className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-[16/11] lg:translate-x-6"
          />
          <img
            src={progresemosLogo}
            alt="Logo de PROGRESEMOS"
            className="absolute -bottom-6 -left-4 hidden h-28 w-28 rounded-2xl object-cover shadow-lg sm:block lg:-left-8"
          />
        </div>
      </div>

      <div className="container-editorial mt-20">
        <blockquote className="rounded-2xl border border-brand-green/20 bg-brand-green/5 px-8 py-10 sm:px-12">
          <p className="font-display text-xl font-semibold leading-snug text-brand-gray-900 sm:text-2xl">
            Al 2030, ser una provincia líder en turismo y desarrollo productivo, con
            una economía competitiva, sostenible e inclusiva que mejore la calidad
            de vida de su población.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
