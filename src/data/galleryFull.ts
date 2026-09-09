import mitinDiaBanderas from "../assets/campana-mitin-dia-banderas.jpg";
import mitinDiaEscenario from "../assets/campana-mitin-dia-escenario.jpg";
import mitinNoche1 from "../assets/campana-mitin-noche-1.jpg";
import mitinNoche2 from "../assets/campana-mitin-noche-2.jpg";
import multitudCapachica from "../assets/campana-multitud-capachica.jpg";
import nosotros from "../assets/nosotros.png";
import lucioIstana from "../assets/lucio-istana.png";
import julioChoque from "../assets/julio-choque.png";
import slideAgro from "../assets/hero-slides/slide-1-agro.png";
import slideJulio from "../assets/hero-slides/slide-2-julio.png";
import slidePasacalle from "../assets/hero-slides/slide-3-pasacalle-istana.png";
import slideCampana from "../assets/hero-slides/slide-4-campana.jpg";

export interface FullGalleryPhoto {
  image: string;
  alt: string;
}

export const galleryFull: FullGalleryPhoto[] = [
  { image: mitinNoche1, alt: "Lucio Istaña saludando en un mitin nocturno de campaña" },
  { image: mitinDiaBanderas, alt: "Escenario de campaña con banderas de PROGRESEMOS" },
  { image: mitinDiaEscenario, alt: "Mitin de campaña de día en la provincia de Puno" },
  { image: mitinNoche2, alt: "Actividad de campaña nocturna de PROGRESEMOS" },
  { image: multitudCapachica, alt: "Multitud de simpatizantes en Capachica" },
  { image: nosotros, alt: "Caminata de PROGRESEMOS junto a vecinos de la provincia de Puno" },
  { image: lucioIstana, alt: "Retrato de Lucio Istaña, candidato a la Alcaldía Provincial" },
  { image: julioChoque, alt: "Retrato de Julio Choque, candidato a Regidor" },
  { image: slideAgro, alt: "Lucio Istaña junto a productores del campo" },
  { image: slideJulio, alt: "Julio Choque en campaña por PROGRESEMOS" },
  { image: slidePasacalle, alt: "Pasacalle de campaña de Lucio Istaña" },
  { image: slideCampana, alt: "Lucio Istaña en campaña con vecinos de la provincia de Puno" },
];
