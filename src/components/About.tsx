import cercaniaComunidad from "../assets/campana-cercania-comunidad.jpg";

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
            Creemos en una Puno segura, moderna y productiva, donde cada distrito
            del altiplano —de Chucuito a Platería y Acora— tenga las mismas
            oportunidades de crecer y prosperar.
          </p>
        </div>

        <div className="relative lg:col-span-7">
          <img
            src={cercaniaComunidad}
            alt="Lucio Istaña saludando a vecinos en una comunidad de la provincia de Puno"
            className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-[16/11] lg:translate-x-6"
          />
          <div className="absolute -bottom-6 -left-4 hidden h-28 w-28 rounded-2xl bg-brand-yellow sm:block lg:-left-8" />
        </div>
      </div>
    </section>
  );
}
