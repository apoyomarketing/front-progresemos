import { useEffect, useRef, useState } from "react";

// Los navegadores bloquean el autoplay con sonido sin un gesto del usuario —
// por eso `play()` se llama recién cuando el jugador interactúa (clic en una
// ficha, botón de silenciar), y si el intento automático al iniciar el nivel
// falla, simplemente queda pendiente hasta esa primera interacción.
export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  function play() {
    audioRef.current?.play().catch(() => {
      // Se reintenta en la próxima interacción del usuario.
    });
  }

  function pause() {
    audioRef.current?.pause();
  }

  function toggleMute() {
    setMuted((prev) => {
      const next = !prev;
      if (!next) play();
      return next;
    });
  }

  return { play, pause, muted, toggleMute };
}
