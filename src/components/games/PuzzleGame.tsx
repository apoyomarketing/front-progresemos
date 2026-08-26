import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  areAdjacent,
  createSlidingBoard,
  createSwapBoard,
  isSlidingSolved,
  isSwapSolved,
  tileBackgroundStyle,
} from "../../lib/puzzle";
import { useBackgroundMusic } from "../../hooks/useBackgroundMusic";
import bgMusic from "../../assets/games/LuisIstaña.mp3";

const LEVELS = [
  { size: 3, label: "Nivel 1" },
  { size: 4, label: "Nivel 2" },
  { size: 5, label: "Nivel 3" },
];

interface PuzzleGameProps {
  mode: "slide" | "swap";
  images: string[];
}

export default function PuzzleGame({ mode, images }: PuzzleGameProps) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [board, setBoard] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const music = useBackgroundMusic(bgMusic);

  const level = LEVELS[levelIndex];
  const image = images[levelIndex % images.length];
  const isLastLevel = levelIndex === LEVELS.length - 1;

  // GamesPage monta este componente con `key={slug}`, así que un cambio de
  // juego ya es una instancia nueva — este efecto solo reacciona a cambios
  // de nivel dentro del mismo juego.
  useEffect(() => {
    setBoard(mode === "slide" ? createSlidingBoard(level.size) : createSwapBoard(level.size));
    setSelected(null);
    setMoves(0);
    setSolved(false);
    music.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex]);

  useEffect(() => {
    return () => music.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetLevel() {
    setBoard(mode === "slide" ? createSlidingBoard(level.size) : createSwapBoard(level.size));
    setSelected(null);
    setMoves(0);
    setSolved(false);
  }

  function handleTileClick(cellIndex: number) {
    if (solved) return;
    music.play();

    if (mode === "slide") {
      const blankIndex = board.indexOf(null);
      if (!areAdjacent(cellIndex, blankIndex, level.size)) return;
      const next = [...board];
      [next[cellIndex], next[blankIndex]] = [next[blankIndex], next[cellIndex]];
      setBoard(next);
      setMoves((m) => m + 1);
      if (isSlidingSolved(next)) setSolved(true);
      return;
    }

    if (selected === null) {
      setSelected(cellIndex);
      return;
    }
    if (selected === cellIndex) {
      setSelected(null);
      return;
    }
    const next = [...board] as number[];
    [next[selected], next[cellIndex]] = [next[cellIndex], next[selected]];
    setBoard(next);
    setSelected(null);
    setMoves((m) => m + 1);
    if (isSwapSolved(next)) setSolved(true);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-brand-green/10 px-4 py-1.5 text-sm font-semibold text-brand-green-dark">
            {level.label} · {level.size}×{level.size}
          </span>
          <span className="text-sm text-brand-gray-900/50">{moves} movimientos</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetLevel}
            aria-label="Reiniciar nivel"
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark"
          >
            <RotateCcw size={17} />
          </button>
          <button
            type="button"
            onClick={music.toggleMute}
            aria-label={music.muted ? "Activar música" : "Silenciar música"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-brand-gray-50 hover:text-brand-green-dark"
          >
            {music.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </div>

      <div
        className="mx-auto mt-8 grid aspect-square w-full max-w-md gap-1.5 rounded-2xl border border-brand-gray-900/10 bg-brand-gray-50 p-1.5"
        style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }}
      >
        {board.map((tile, cellIndex) =>
          tile === null ? (
            <div key={`blank-${cellIndex}`} className="aspect-square" />
          ) : (
            <button
              key={tile}
              type="button"
              onClick={() => handleTileClick(cellIndex)}
              style={tileBackgroundStyle(image, tile, level.size)}
              aria-label={`Ficha ${tile + 1}`}
              className={`aspect-square rounded-lg border-0 bg-white p-0 transition-shadow ${
                selected === cellIndex ? "ring-4 ring-brand-green" : ""
              }`}
            />
          ),
        )}
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-brand-green/10 px-6 py-8 text-center"
        >
          <p className="font-display text-lg font-bold text-brand-gray-900">
            ¡Completaste el {level.label.toLowerCase()} en {moves} movimientos!
          </p>
          {isLastLevel ? (
            <p className="text-sm text-brand-gray-900/60">Superaste todos los niveles. ¡Gracias por jugar!</p>
          ) : (
            <button
              type="button"
              onClick={() => setLevelIndex((i) => i + 1)}
              className="rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
            >
              Siguiente nivel
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
