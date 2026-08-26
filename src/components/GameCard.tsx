import { motion } from "framer-motion";
import { LayoutGrid, Puzzle } from "lucide-react";
import Button from "./Button";
import type { GameEntry } from "../data/games";

const iconMap: Record<GameEntry["icon"], typeof LayoutGrid> = {
  grid: LayoutGrid,
  puzzle: Puzzle,
};

const accents = ["bg-brand-green text-white", "bg-brand-lime text-brand-gray-900"];

export default function GameCard({ game, index }: { game: GameEntry; index: number }) {
  const Icon = iconMap[game.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-between rounded-2xl border border-brand-gray-900/10 bg-white p-8 transition-colors duration-300 hover:border-brand-green/40"
    >
      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accents[index % accents.length]}`}>
        <Icon size={26} strokeWidth={1.75} />
      </span>
      <div className="mt-8">
        <h3 className="font-display text-xl font-bold text-brand-gray-900">{game.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray-900/60">{game.description}</p>
      </div>
      <Button to={`/juegos?juego=${game.slug}`} variant="secondary" className="mt-8 self-start">
        Jugar
      </Button>
    </motion.div>
  );
}
