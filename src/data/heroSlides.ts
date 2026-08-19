import slide1 from "../assets/hero-slides/slide-1-agro.jpg";
import slide2 from "../assets/hero-slides/slide-2-campana.jpg";
import mitinDiaEscenario from "../assets/campana-mitin-dia-escenario.jpg";
import caminataAquino from "../assets/campana-caminata-aquino.jpg";

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
    image: mitinDiaEscenario,
    alt: "Lucio Istaña saludando a la multitud en un mitin de campaña en Capachica",
  },
  {
    image: caminataAquino,
    alt: "Lucio Istaña en caminata de campaña junto a dirigentes y vecinos de la provincia de Puno",
  },
];
