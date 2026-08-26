import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { galleryFull } from "./data/galleryFull";
import { useDocumentHead } from "./hooks/useDocumentHead";

export default function GalleryPage() {
  useDocumentHead({
    title: "Galería de fotos — PROGRESEMOS Puno 2026",
    description:
      "Recorridos, mítines y encuentros de la campaña de PROGRESEMOS en la provincia de Puno.",
  });

  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar solid />

      <main className="pb-24 pt-32 sm:pb-32 sm:pt-40">
        <div className="container-editorial">
          <span className="eyebrow mb-6 block text-brand-green">Galería</span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-gray-900 sm:text-5xl lg:text-6xl">
            La campaña en imágenes
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray-900/70">
            Recorridos, mítines y encuentros con la ciudadanía en toda la provincia de Puno.
          </p>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {galleryFull.map((photo, i) => (
              <motion.div
                key={photo.image}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group overflow-hidden rounded-2xl"
              >
                <img
                  src={photo.image}
                  alt={photo.alt}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
