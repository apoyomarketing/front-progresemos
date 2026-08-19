import puno from "../assets/section-puno/puno.png";
import acora from "../assets/section-puno/acora.png";
import amantani from "../assets/section-puno/amantani.png";
import atuncolla from "../assets/section-puno/atuncolla.png";
import capachica from "../assets/section-puno/capachica.jpg";
import chucuito from "../assets/section-puno/chucuito.png";
import coata from "../assets/section-puno/coata.png";
import huata from "../assets/section-puno/huata.png";
import mañazo from "../assets/section-puno/mañazo.png";
import paucarcolla from "../assets/section-puno/paucarcolla.png";
import pichacani from "../assets/section-puno/pichacani.png";
import plateria from "../assets/section-puno/plateria.png";
import sanAntonio from "../assets/section-puno/san antonio.png";
import tiquillaca from "../assets/section-puno/tiquillaca.png";
import vilque from "../assets/section-puno/vilque.png";
import type { HeroSlide } from "./heroSlides";

export interface PunoSlide extends HeroSlide {
  district: string;
  phrase: string;
}

// Un slide por cada uno de los 15 distritos de la provincia de Puno.
// Igual que heroSlides.ts: para sumar uno nuevo, importa la imagen arriba
// y agrégalo a este array.
export const punoSlides: PunoSlide[] = [
  {
    image: puno,
    alt: "Vista de la ciudad de Puno, capital de la provincia",
    district: "Puno",
    phrase:
      "Corazón administrativo y comercial de la provincia; impulsamos una capital moderna, segura y ordenada para todos sus vecinos.",
  },
  {
    image: acora,
    alt: "Comunidad del distrito de Acora, provincia de Puno",
    district: "Acora",
    phrase:
      "Tierra agrícola y ganadera a orillas del Titicaca; trabajamos por más oportunidades para sus productores.",
  },
  {
    image: amantani,
    alt: "Isla de Amantaní, provincia de Puno",
    district: "Amantaní",
    phrase:
      "Isla de tradición viva en el lago sagrado; promovemos un turismo sostenible que beneficie a sus comunidades.",
  },
  {
    image: atuncolla,
    alt: "Distrito de Atuncolla, provincia de Puno",
    district: "Atuncolla",
    phrase:
      "Cuna de un legado arqueológico único; ponemos en valor su patrimonio cultural y turístico.",
  },
  {
    image: capachica,
    alt: "Península de Capachica, provincia de Puno",
    district: "Capachica",
    phrase:
      "Península de paisajes y turismo vivencial; impulsamos infraestructura y servicios de calidad para su gente.",
  },
  {
    image: chucuito,
    alt: "Distrito de Chucuito, provincia de Puno",
    district: "Chucuito",
    phrase:
      "Historia y arquitectura junto al lago; trabajamos por un distrito con más oportunidades para crecer.",
  },
  {
    image: coata,
    alt: "Distrito de Coata, provincia de Puno",
    district: "Coata",
    phrase:
      "Comunidad ribereña dedicada al campo; apostamos por su desarrollo agrícola y productivo.",
  },
  {
    image: huata,
    alt: "Distrito de Huata, provincia de Puno",
    district: "Huata",
    phrase:
      "Tradición agrícola y artesanal del altiplano; impulsamos su crecimiento con oportunidades reales.",
  },
  {
    image: mañazo,
    alt: "Distrito de Mañazo, provincia de Puno",
    district: "Mañazo",
    phrase:
      "Puerta del altiplano hacia la costa; trabajamos por conectividad y desarrollo productivo.",
  },
  {
    image: paucarcolla,
    alt: "Distrito de Paucarcolla, provincia de Puno",
    district: "Paucarcolla",
    phrase:
      "Mirador natural del lago Titicaca; promovemos turismo responsable y desarrollo local.",
  },
  {
    image: pichacani,
    alt: "Distrito de Pichacani, provincia de Puno",
    district: "Pichacani",
    phrase:
      "Comunidad altiplánica de tradición ganadera; impulsamos su desarrollo con infraestructura moderna.",
  },
  {
    image: plateria,
    alt: "Distrito de Platería, provincia de Puno",
    district: "Platería",
    phrase:
      "Distrito de tradición textil y comercial; trabajamos por más oportunidades para sus emprendedores.",
  },
  {
    image: sanAntonio,
    alt: "Distrito de San Antonio, provincia de Puno",
    district: "San Antonio",
    phrase:
      "Comunidad rural con vocación agropecuaria; impulsamos su desarrollo con servicios públicos de calidad.",
  },
  {
    image: tiquillaca,
    alt: "Distrito de Tiquillaca, provincia de Puno",
    district: "Tiquillaca",
    phrase:
      "Distrito de tradición altiplánica y fuerte identidad comunitaria; trabajamos por igualdad de oportunidades para todos los distritos.",
  },
  {
    image: vilque,
    alt: "Distrito de Vilque, provincia de Puno",
    district: "Vilque",
    phrase:
      "Histórico centro ferial del altiplano; impulsamos su desarrollo comercial y productivo.",
  },
];
