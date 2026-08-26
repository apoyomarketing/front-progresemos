import SectionHeader from "./SectionHeader";
import GameCard from "./GameCard";
import { games } from "../data/games";

export default function Games() {
  return (
    <section id="juegos" className="bg-gradient-to-br from-brand-lime/15 via-brand-yellow/10 to-white py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader
          eyebrow="06 — Juegos"
          title="Diviértete mientras conoces la campaña"
          description="Espacios interactivos para acercarte a PROGRESEMOS de una forma distinta."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {games.map((game, i) => (
            <GameCard game={game} index={i} key={game.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
