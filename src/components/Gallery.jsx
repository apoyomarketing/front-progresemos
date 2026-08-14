import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Reveal from "./Reveal.jsx";

// Placeholder: reemplazar con fotografías reales en src/assets/gallery
// y actualizar este arreglo con { src, caption }.
const PLACEHOLDER_ITEMS = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  caption: `Fotografía de evento (placeholder ${i + 1})`,
  tall: i % 3 === 0,
}));

export default function Gallery() {
  const [active, setActive] = useState(null);

  const openAt = (i) => setActive(i);
  const close = () => setActive(null);
  const next = () => setActive((a) => (a + 1) % PLACEHOLDER_ITEMS.length);
  const prev = () => setActive((a) => (a - 1 + PLACEHOLDER_ITEMS.length) % PLACEHOLDER_ITEMS.length);

  return (
    <section id="galeria" className="py-20 md:py-28 bg-grisclaro">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-12">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave mb-3">
            Galería
          </h2>
          <p className="text-gristexto">
            Fotografías de eventos y actividades. Imágenes placeholder — reemplazar con material real.
          </p>
        </Reveal>

        <div className="columns-2 md:columns-4 gap-4 [column-fill:_balance]">
          {PLACEHOLDER_ITEMS.map((item, i) => (
            <button
              key={item.id}
              onClick={() => openAt(i)}
              className={`mb-4 w-full break-inside-avoid rounded-2xl bg-gradient-to-br from-verde-principal to-verde-profundo flex items-center justify-center text-white/70 focus-ring ${
                item.tall ? "h-64" : "h-40"
              }`}
              aria-label={item.caption}
            >
              <ImageIcon size={28} />
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 bg-negrosuave/90 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
        >
          <button onClick={close} aria-label="Cerrar" className="absolute top-6 right-6 text-white focus-ring rounded">
            <X size={28} />
          </button>
          <button onClick={prev} aria-label="Anterior" className="absolute left-4 md:left-10 text-white focus-ring rounded">
            <ChevronLeft size={32} />
          </button>
          <div className="w-full max-w-2xl aspect-video rounded-2xl bg-gradient-to-br from-verde-principal to-verde-profundo flex items-center justify-center text-white text-center px-6">
            {PLACEHOLDER_ITEMS[active].caption}
          </div>
          <button onClick={next} aria-label="Siguiente" className="absolute right-4 md:right-10 text-white focus-ring rounded">
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  );
}
