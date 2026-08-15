import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { StatItem } from "../data/stats";

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * ease(progress)));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

export default function StatCounter({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const value = useCountUp(stat.value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-brand-gray-900/10 pt-6"
    >
      <div className="font-display text-5xl font-extrabold tracking-tight text-brand-green-dark sm:text-6xl lg:text-7xl">
        {stat.prefix}
        {value}
        {stat.suffix}
      </div>
      <p className="mt-3 text-sm font-medium uppercase tracking-wide text-brand-gray-900/60">
        {stat.label}
      </p>
    </motion.div>
  );
}
