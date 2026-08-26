import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PuzzleGame from "./components/games/PuzzleGame";
import { games } from "./data/games";
import { puzzleImages } from "./data/puzzleImages";
import { shuffleArray } from "./lib/puzzle";
import { useDocumentHead } from "./hooks/useDocumentHead";

export default function GamesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = searchParams.get("juego") ?? games[0].slug;
  const activeGame = games.find((g) => g.slug === activeSlug) ?? games[0];
  // Mismo orden de imágenes para los dos juegos — se baraja una vez por
  // visita a la página, no cada vez que se cambia de juego.
  const [images] = useState(() => shuffleArray(puzzleImages));

  useDocumentHead({
    title: `${activeGame.title} — PROGRESEMOS Puno 2026`,
    description: "Juegos interactivos de la campaña de PROGRESEMOS en la provincia de Puno.",
  });

  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar solid />

      <main className="pb-24 pt-32 sm:pb-32 sm:pt-40">
        <div className="container-editorial">
          <span className="eyebrow mb-6 block text-brand-green">Juegos</span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-gray-900 sm:text-5xl lg:text-6xl">
            {activeGame.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray-900/70">
            {activeGame.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3" role="tablist" aria-label="Elegir juego">
            {games.map((game) => (
              <button
                key={game.slug}
                type="button"
                role="tab"
                aria-selected={game.slug === activeGame.slug}
                onClick={() => setSearchParams({ juego: game.slug })}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  game.slug === activeGame.slug
                    ? "bg-brand-green text-white"
                    : "border border-brand-gray-900/15 text-brand-gray-900/70 hover:bg-brand-gray-50"
                }`}
              >
                {game.title}
              </button>
            ))}
          </div>

          <div className="mt-12">
            <PuzzleGame
              key={activeGame.slug}
              mode={activeGame.slug === "numpuz" ? "slide" : "swap"}
              images={images}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
