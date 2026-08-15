import slide1 from "../assets/hero-slides/slide-1-agro.jpg";
import slide2 from "../assets/hero-slides/slide-2-campana.jpg";
import slide3 from "../assets/hero-slides/slide-3-fondo.jpg";

export interface HeroSlide {
  image: string;
  alt: string;
}

// Agrega más imágenes aquí para sumarlas al carrusel del Hero.
// No basta con copiar el archivo a assets/hero-slides: hay que importarlo
// arriba y sumarlo a este array. Cada 5 segundos el fondo avanza solo.
export const heroSlides: HeroSlide[] = [
  {
    image: slide1,
    alt: "Lucio Istaña, candidato de PROGRESEMOS a la Alcaldía Provincial de Puno, junto a productores del campo",
  },
  {
    image: slide2,
    alt: "Lucio Istaña en campaña con vecinos de la provincia de Puno",
  },
  {
    image: slide3,
    alt: "Paisaje de la provincia de Puno, escenario de la propuesta de PROGRESEMOS",
  },
];
