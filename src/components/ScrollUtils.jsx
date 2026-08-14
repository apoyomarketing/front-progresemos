import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollUtils() {
  const [width, setWidth] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setWidth(Number.isFinite(pct) ? pct : 0);
      setShowTop(h.scrollTop > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="progress-bar" style={{ width: `${width}%` }} />
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Volver arriba"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-verde-principal hover:bg-verde-oscuro text-white flex items-center justify-center shadow-lg transition-colors focus-ring"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </>
  );
}
