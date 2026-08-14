import { motion } from "framer-motion";

/**
 * Envuelve contenido con una animación sutil de aparición al entrar
 * en el viewport. Uso: <Reveal delay={100}>...</Reveal>
 */
export default function Reveal({ children, className = "", delay = 0, as = "div" }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}
