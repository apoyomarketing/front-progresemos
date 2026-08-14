# Progresemos — Landing page institucional

Landing page para el partido político **Progresemos**, construida con React + Vite + Tailwind CSS.

## Stack

- React 19 + React Router (páginas: inicio, propuestas, candidato, noticias)
- Vite
- Tailwind CSS (tokens de color y tipografía en `tailwind.config.js`)
- lucide-react (iconografía)
- framer-motion (animaciones de aparición al hacer scroll)

## Cómo correrlo

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción en /dist
npm run preview   # previsualizar el build
```

## Estructura

```text
src/
├── components/     # componentes reutilizables (uno por sección)
├── data/           # contenido editable, separado del diseño
├── pages/          # ensamblan componentes en rutas (/, /propuestas, /candidato, /noticias)
├── assets/         # logo, foto del candidato, galería (colocar aquí)
├── App.jsx
├── main.jsx
└── index.css       # tokens globales, texturas de fondo, utilidades
```

## Contenido pendiente de completar

Todo el contenido de ejemplo está marcado explícitamente en el código
(comentarios "placeholder" / "reemplazar") y debe completarse con
información real y verificada antes de publicar el sitio:

- `src/data/candidate.js` — biografía, trayectoria y foto del candidato
  (`candidate.photo`). No inventar títulos, cargos ni logros.
- `src/data/proposals.js` — propuestas reales por categoría.
- `src/data/agenda.js` — actividades y fechas confirmadas.
- `src/data/news.js` — noticias reales.
- `src/data/documents.js` — enlaces a documentos institucionales reales.
- `src/data/social.js` — URLs de las cuentas oficiales verificadas.
- `src/components/Contact.jsx` — datos de contacto reales (`CONTACT_INFO`)
  y conexión del formulario a un backend/servicio de envío real.
- `src/components/Gallery.jsx` — reemplazar los bloques de color por
  fotografías reales en `src/assets/gallery/`.

## Paleta

| Token              | Valor     |
|--------------------|-----------|
| verde-principal    | `#159447` |
| verde-oscuro       | `#087A38` |
| verde-profundo     | `#075B2B` |
| verde-brillante    | `#65C91A` |
| verde-lima         | `#A7D92B` |
| gris-claro         | `#F4F7F4` |
| gris-texto         | `#374151` |
| negro-suave        | `#111827` |
