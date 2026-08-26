import type { CSSProperties } from "react";

export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getNeighbors(index: number, size: number): number[] {
  const row = Math.floor(index / size);
  const col = index % size;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(index - size);
  if (row < size - 1) neighbors.push(index + size);
  if (col > 0) neighbors.push(index - 1);
  if (col < size - 1) neighbors.push(index + 1);
  return neighbors;
}

export function areAdjacent(a: number, b: number, size: number): boolean {
  const rowA = Math.floor(a / size);
  const colA = a % size;
  const rowB = Math.floor(b / size);
  const colB = b % size;
  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

// Tablero para Numpuz (deslizar): `null` marca el hueco vacío. Se arma
// aplicando movimientos válidos al azar desde el estado resuelto — así queda
// garantizado que siempre es resoluble (no todo arreglo aleatorio de un
// "15 puzzle" lo es).
export function createSlidingBoard(size: number): (number | null)[] {
  const total = size * size;
  const board: (number | null)[] = Array.from({ length: total - 1 }, (_, i) => i);
  board.push(null);

  let blank = total - 1;
  const shuffleMoves = total * 25;
  for (let i = 0; i < shuffleMoves; i++) {
    const neighbors = getNeighbors(blank, size);
    const target = neighbors[Math.floor(Math.random() * neighbors.length)];
    [board[blank], board[target]] = [board[target], board[blank]];
    blank = target;
  }
  return board;
}

export function isSlidingSolved(board: (number | null)[]): boolean {
  const last = board.length - 1;
  return board.every((tile, i) => (i === last ? tile === null : tile === i));
}

// Tablero para Rompecabezas (intercambiar): todas las celdas ocupadas, sin
// hueco — se barajan las piezas hasta que el arreglo no salga ya resuelto.
export function createSwapBoard(size: number): number[] {
  const total = size * size;
  const solved = Array.from({ length: total }, (_, i) => i);
  let shuffled = shuffleArray(solved);
  while (total > 1 && shuffled.every((tile, i) => tile === i)) {
    shuffled = shuffleArray(solved);
  }
  return shuffled;
}

export function isSwapSolved(board: number[]): boolean {
  return board.every((tile, i) => tile === i);
}

// Recorta visualmente una sola imagen en una grilla de size×size usando
// background-position, sin depender de herramientas externas de edición.
export function tileBackgroundStyle(image: string, tileId: number, size: number): CSSProperties {
  const row = Math.floor(tileId / size);
  const col = tileId % size;
  const step = size === 1 ? 0 : 100 / (size - 1);
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: `${size * 100}% ${size * 100}%`,
    backgroundPosition: `${col * step}% ${row * step}%`,
  };
}
