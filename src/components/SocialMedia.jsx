import * as Icons from "lucide-react";
import Reveal from "./Reveal.jsx";
import { socialLinks } from "../data/social.js";

export default function SocialMedia() {
  return (
    <section className="py-16 bg-verde-profundo contour-bg">
      <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
        <Reveal>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white mb-2">Síguenos</h2>
          <p className="text-white/70 text-sm mb-8">Cuentas oficiales por configurar.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {socialLinks.map((s) => {
              const IconComp = Icons[s.icon] || Icons.Link;
              return (
                <a
                  key={s.label}
                  href={s.url}
                  aria-label={s.label}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-verde-lima hover:text-verde-profundo text-white flex items-center justify-center transition-colors focus-ring"
                >
                  <IconComp size={20} />
                </a>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
