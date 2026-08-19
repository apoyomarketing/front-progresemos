import Button from "./Button";
import ContourMotif from "./ContourMotif";
import HeroCarousel from "./HeroCarousel";
import { heroSlides } from "../data/heroSlides";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[70vh] items-end overflow-hidden bg-brand-gray-900 sm:min-h-[85vh] lg:min-h-screen"
    >
      <HeroCarousel slides={heroSlides} />

      <div className="container-editorial relative z-10 w-full pb-16 pt-40 sm:pb-28 sm:pt-48">
        <div className="max-w-3xl">
          <span className="eyebrow mb-6 inline-block text-brand-lime">
            PROGRESEMOS — Puno 2026
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block">PUNO SEGURO,</span>
            <span className="block">MODERNO Y</span>
            <span className="block">PRODUCTIVO</span>
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/85 sm:text-xl">
            Lucio Istaña, candidato a la Alcaldía Provincial de Puno. Un equipo
            comprometido con el desarrollo de cada distrito.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="#propuestas" variant="primary">
              Conoce nuestras propuestas
            </Button>
            <Button href="#candidatos" variant="ghost">
              Conoce al candidato
            </Button>
          </div>
        </div>
      </div>

      <ContourMotif className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 w-full text-brand-lime/30 sm:h-24" />
    </section>
  );
}
