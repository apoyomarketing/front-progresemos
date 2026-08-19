import slide1 from "../assets/hero-slides/slide-1-agro.jpg";
import slide2 from "../assets/hero-slides/slide-2-julio.png";
import slide3 from "../assets/hero-slides/slide-3-pasacalle-istana.png";
import slide4 from "../assets/hero-slides/slide-4-campana.jpg";

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
    alt: "Julio Choque en campaña por PROGRESEMOS",
  },
  {
    image: slide3,
    alt: "Pasacalle de campaña de Lucio Istaña por PROGRESEMOS",
  },
  {
    image: slide4,
    alt: "Lucio Istaña en campaña con vecinos de la provincia de Puno",
  },
];
