import { motion } from "framer-motion";
import PhotoPlaceholder from "./PhotoPlaceholder";
import Button from "./Button";

export default function Participation() {
  return (
    <section id="participa" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0">
        <PhotoPlaceholder label="Ciudadanos movilizados" tone="green" className="h-full w-full" />
        <div className="absolute inset-0 bg-brand-green-dark/80" />
      </div>

      <div className="container-editorial relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            El cambio comienza contigo
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/85 sm:text-xl">
            Construyamos juntos una Puno segura, moderna y productiva.
          </p>

          <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="#" variant="light">
              Quiero participar
            </Button>
            <Button href="#" variant="ghost">
              Conoce cómo afiliarte
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
