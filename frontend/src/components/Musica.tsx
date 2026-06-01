import { useEffect, useRef, useState } from "react";

const PISTAS = ["/musica/wavin_flag.mp3"];

export default function Musica() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sonando, setSonando] = useState(false);
  const [pista] = useState(
    () => PISTAS[Math.floor(Math.random() * PISTAS.length)]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.play().then(() => setSonando(true)).catch(() => setSonando(false));
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (sonando) {
      audio.pause();
      setSonando(false);
    } else {
      audio.play().then(() => setSonando(true)).catch(() => {});
    }
  };

  const siguiente = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = PISTAS[Math.floor(Math.random() * PISTAS.length)];
    audio.play().then(() => setSonando(true)).catch(() => {});
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex gap-2">
      <audio ref={audioRef} src={pista} loop onEnded={siguiente} />
      <button
        onClick={toggle}
        className="bg-black/50 backdrop-blur text-white w-11 h-11 rounded-full shadow-lg hover:bg-black/70 transition"
        title={sonando ? "Pausar" : "Reproducir"}
      >
        {sonando ? "⏸️" : "▶️"}
      </button>
      <button
        onClick={siguiente}
        className="bg-black/50 backdrop-blur text-white w-11 h-11 rounded-full shadow-lg hover:bg-black/70 transition"
        title="Otra canción"
      >
        🔀
      </button>
    </div>
  );
}