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
      <div className="overflow-hidden rounded-2xl bg-brand-green/10">
        <img
          src={photos[profile.photo]}
          alt={`Retrato de ${profile.name}`}
          className="aspect-[3/4] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-5">
        <h3 className="font-display text-xl font-bold text-brand-gray-900">{profile.name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-green-dark">{profile.role}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-gray-900/50">
          <MapPin size={14} strokeWidth={2} />
          {profile.region}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-900/65">{profile.description}</p>
      </div>
    </motion.article>
  );
}
