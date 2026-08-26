import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Button from "./Button";
import { galleryPreview } from "../data/gallery";
import logo from "../assets/progresemos-logo.png";

export default function Gallery() {
  return (
    <section id="galeria" className="bg-white py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="07 — Galería"
          title="La campaña en imágenes"
          description="Momentos de nuestros recorridos, mítines y encuentros con la ciudadanía en toda la provincia."
        />

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {galleryPreview.map((photo, i) => (
            <motion.div
              key={photo.image}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`group overflow-hidden rounded-2xl ${i < 3 ? "col-span-2" : "col-span-1"}`}
            >
              {photo.variant === "brand" ? (
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-lime">
                  <img
                    src={logo}
                    alt={photo.alt}
                    className="h-16 w-16 rounded-xl object-cover shadow-lg ring-2 ring-white/40"
                  />
                  <span className="font-display text-sm font-bold tracking-tight text-white">PROGRESEMOS</span>
                </div>
              ) : (
                <img
                  src={photo.image}
                  alt={photo.alt}
                  className="h-full min-h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:min-h-[260px]"
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button to="/galeria" variant="secondary">
            Mostrar más
          </Button>
        </div>
      </div>
    </section>
  );
}
