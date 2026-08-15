import { Camera } from "lucide-react";

interface PhotoPlaceholderProps {
  label: string;
  className?: string;
  tone?: "green" | "dark" | "lime";
}

const tones: Record<string, string> = {
  green: "from-brand-green-dark via-brand-green to-brand-lime",
  dark: "from-brand-gray-900 via-brand-green-dark to-brand-green",
  lime: "from-brand-green via-brand-lime to-brand-yellow",
};

/**
 * Stand-in for real documentary photography. Clearly marked as a
 * placeholder (per project spec) while still reading as an intentional
 * editorial block — a duotone field with a caption — rather than a
 * broken image. Swap for a real <img> when photography is available.
 */
export default function PhotoPlaceholder({
  label,
  className = "",
  tone = "green",
}: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Fotografía de reemplazo: ${label}`}
      className={`relative overflow-hidden bg-gradient-to-br ${tones[tone]} ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-25 mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id={`grain-${label.replace(/\s+/g, "")}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${label.replace(/\s+/g, "")})`} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
        <Camera size={16} strokeWidth={1.75} />
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </div>
    </div>
  );
}
