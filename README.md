# PROGRESEMOS — Landing page institucional

Landing page oficial para el partido político peruano PROGRESEMOS, construida con
React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion.

## Empezar

```bash
npm install
npm run dev       # entorno de desarrollo
npm run build     # build de producción (carpeta dist/)
npm run preview   # previsualizar el build de producción
```

## Estructura

```
src/
├── components/   # componentes de sección y componentes reutilizables
├── data/         # contenido editable, separado de los componentes
├── App.tsx       # composición de la página
├── main.tsx
└── index.css     # tokens de diseño (colores, tipografía) vía Tailwind v4 @theme
```

## Carrusel del Hero

El fondo del Hero es un carrusel de imágenes que cambia automáticamente cada
5 segundos (como en el sitio de referencia de Alianza Para el Progreso), con
flechas y puntos de navegación que aparecen solos en cuanto hay más de una
imagen.

Para agregar más fotos, edita `src/data/heroSlides.ts`:

```ts
import miNuevaFoto from "../assets/hero-slides/mi-foto.jpg";

export const heroSlides: HeroSlide[] = [
  { image: slide1, alt: "..." },
  { image: miNuevaFoto, alt: "Descripción de la foto" },
];
```

Recomendaciones para las fotos del carrusel:
- Formato apaisado (horizontal), idealmente cerca de 16:9 o más ancho.
- Evita imágenes con texto propio (nombres, fechas) ya incluido, porque
  compite visualmente con el título del Hero que se superpone encima.
- Guárdalas como `.jpg` optimizado (calidad ~80-85) para no afectar el
  tiempo de carga.

## Contenido pendiente de reemplazo

Este proyecto usa **placeholders de fotografía** (bloques en degradé verde con
etiqueta identificatoria) en lugar de fotografías reales, ya que no se
proporcionaron imágenes. Cada uno está marcado con el componente
`PhotoPlaceholder` y es fácil de reemplazar por un `<img>` real.

También incluye:
- Perfiles de liderazgo ficticios (`src/data/leadership.ts`) — reemplazar con
  información real antes de publicar.
- Cifras de impacto demostrativas (`src/data/stats.ts`) — marcadas explícitamente
  como no oficiales.
- Noticias y documentos de ejemplo (`src/data/news.ts`, `src/data/documents.ts`).

## Paleta de marca

| Uso | Color |
|---|---|
| Verde principal | `#299527` |
| Verde institucional | `#4CAD30` |
| Verde lima | `#7ABB2F` |
| Verde oscuro | `#176B24` |
| Amarillo de acento | `#F5E20B` |

## Tipografía

Plus Jakarta Sans (títulos) + Inter (texto e interfaz).
