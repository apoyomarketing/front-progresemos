import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { LeaderProfile } from "../data/leadership";
import lucioPhoto from "../assets/lucio-istana.png";
import julioPhoto from "../assets/julio-choque.png";

const photos: Record<string, string> = {
  lucio: lucioPhoto,
  julio: julioPhoto,
};

export default function ProfileCard({ profile, index }: { profile: LeaderProfile; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-brand-green/10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-20px_rgba(23,107,36,0.35)]">
        <img
          src={photos[profile.photo]}
          alt={`Retrato de ${profile.name}`}
          className="aspect-[3/4] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
      <div className="mt-5">
        <h3 className="font-display text-xl font-bold text-brand-gray-900">{profile.name}</h3>
        <span className="mt-2 inline-block rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green-dark">
          {profile.role}
        </span>
        <p className="mt-2.5 flex items-center gap-1.5 text-sm text-brand-gray-900/50">
          <MapPin size={14} strokeWidth={2} />
          {profile.region}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-900/65">{profile.description}</p>
      </div>
    </motion.article>
  );
}
