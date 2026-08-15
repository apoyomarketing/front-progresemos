import slide1 from "../assets/hero-slides/slide-1-agro.jpg";

export interface HeroSlide {
  image: string;
  alt: string;
}

// Agrega más imágenes aquí para sumarlas al carrusel del Hero.
// Cada 5 segundos el fondo avanza automáticamente a la siguiente.
export const heroSlides: HeroSlide[] = [
  {
    image: slide1,
    alt: "Lucio Istaña, candidato de PROGRESEMOS a la Alcaldía Provincial de Puno, junto a productores del campo",
  },
];
