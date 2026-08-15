interface ContourMotifProps {
  className?: string;
}

/**
 * Signature graphic device for PROGRESEMOS: a single continuous line that
 * reads simultaneously as the silhouette of the Andean altiplano (Puno)
 * and as an ascending progress line. Used sparingly across the page as
 * the one recurring visual signature.
 */
export default function ContourMotif({ className = "" }: ContourMotifProps) {
  return (
    <svg
      viewBox="0 0 400 100"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        className="contour-line"
        d="M0 85 L40 85 L70 40 L95 60 L130 20 L160 55 L190 30 L225 65 L260 45 L300 15 L340 50 L400 5"
      />
    </svg>
  );
}
