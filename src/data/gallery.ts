import nosotros from "../assets/nosotros.png";
import logo from "../assets/progresemos-logo.png";
import mitinDiaBanderas from "../assets/campana-mitin-dia-banderas.jpg";
import mitinNoche1 from "../assets/campana-mitin-noche-1.jpg";
import julioSlide from "../assets/hero-slides/slide-2-julio.png";

export interface GalleryPhoto {
  image: string;
  alt: string;
  // "brand" da un tratamiento especial (tarjeta de marca) en vez de foto a
  // sangre completa — pensado para el logo, no para fotografías de campaña.
  variant?: "brand";
}

// Selección destacada que se muestra en el landing. La galería completa
// (más fotos) vive en /galeria — ver src/data/galleryFull.ts.
export const galleryPreview: GalleryPhoto[] = [
  { image: mitinNoche1, alt: "Lucio Istaña saludando en un mitin nocturno de campaña" },
  { image: mitinDiaBanderas, alt: "Escenario de campaña con banderas de PROGRESEMOS" },
  { image: nosotros, alt: "Caminata de PROGRESEMOS junto a vecinos de la provincia de Puno" },
  { image: julioSlide, alt: "Julio Choque en campaña por PROGRESEMOS" },
  { image: logo, alt: "Logotipo de PROGRESEMOS", variant: "brand" },
];
