import { motion } from "framer-motion";
import {
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  Hammer,
  Sprout,
  Cpu,
  Map as MapIcon,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { axes } from "../data/axes";
import type { Axis } from "../data/axes";
import multitudCapachica from "../assets/campana-multitud-capachica.jpg";

const realPhotos: Partial<Record<Axis["number"], string>> = {
  "01": multitudCapachica,
};

const iconMap: Record<Axis["icon"], typeof GraduationCap> = {
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  "shield-check": ShieldCheck,
  "trending-up": TrendingUp,
  hammer: Hammer,
  sprout: Sprout,
  cpu: Cpu,
  map: MapIcon,
};

const sizeClasses: Record<Axis["size"], string> = {
  lg: "sm:col-span-4 lg:col-span-5 lg:row-span-2",
  md: "sm:col-span-4 lg:col-span-4",
  sm: "sm:col-span-2 lg:col-span-3",
};

function AxisCard({ axis, index }: { axis: Axis; index: number }) {
  const Icon = iconMap[axis.icon];
  const isLarge = axis.size === "lg";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-gray-900/10 bg-white p-7 transition-shadow duration-300 hover:shadow-[0_20px_50px_-20px_rgba(23,107,36,0.25)] ${sizeClasses[axis.size]}`}
    >
      {axis.photo && (
        <PhotoPlaceholder
          label={axis.photo}
          tone="green"
          className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.06] ${isLarge ? "" : ""}`}
        />
      )}

      <div className="relative flex items-start justify-between">
        <span className="font-display text-sm font-semibold text-brand-gray-900/30">
          {axis.number}
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gray-50 text-brand-green-dark transition-colors duration-300 group-hover:bg-brand-green group-hover:text-white">
          <Icon size={20} strokeWidth={1.75} />
        </span>
      </div>

      <div className="relative mt-8">
        <h3 className={`font-display font-bold text-brand-gray-900 ${isLarge ? "text-3xl" : "text-xl"}`}>
          {axis.title}
        </h3>
        <p className={`mt-3 text-brand-gray-900/65 leading-relaxed ${isLarge ? "text-base max-w-sm" : "text-sm"}`}>
          {axis.description}
        </p>
      </div>

      {isLarge && axis.photo && (
        realPhotos[axis.number] ? (
          <img
            src={realPhotos[axis.number]}
            alt={axis.photo}
            className="relative mt-8 aspect-[16/10] w-full rounded-xl object-cover"
          />
        ) : (
          <PhotoPlaceholder
            label={axis.photo}
            tone="lime"
            className="relative mt-8 aspect-[16/10] w-full rounded-xl"
          />
        )
      )}
    </motion.article>
  );
}

export default function Axes() {
  return (
    <section id="ejes" className="bg-white py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="Nuestros ejes"
          title="Los pilares de nuestro progreso"
          description="Ocho ejes estratégicos que guían nuestras propuestas y nuestro trabajo territorial en todo el país."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-8 lg:grid-cols-10">
          {axes.map((axis, i) => (
            <AxisCard axis={axis} index={i} key={axis.number} />
          ))}
        </div>
      </div>
    </section>
  );
}
