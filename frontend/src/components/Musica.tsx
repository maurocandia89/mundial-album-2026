import { useEffect, useRef, useState } from "react";

const PISTAS = [
  "/musica/echo.mp3",
  "/musica/Blessings.mp3",
  "/musica/Energy.mp3",
  "/musica/GameTime.mp3",
  "/musica/Goals.mp3",
  "/musica/Illuminate.mp3",
  "/musica/IShowSpeed.mp3",
  "/musica/Lighter.mp3",
  "/musica/LoveAlwaysWins.mp3",
  "/musica/MiMexicoLindo.mp3",
  "/musica/NoPlaceLikeHome.mp3",
  "/musica/Partidazo.mp3",
  "/musica/SiirSiir.mp3",
  "/musica/ThreeNations.mp3",
];

function indiceAleatorio() {
  return Math.floor(Math.random() * PISTAS.length);
}

export default function Musica() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sonando, setSonando] = useState(false);
  const [pistaIndex, setPistaIndex] = useState(indiceAleatorio);

  const reproducir = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;

    try {
      await audio.play();
    } catch {
      // El navegador puede bloquear autoplay hasta la primera interacción.
    }
  };

  useEffect(() => {
    void reproducir();

    const reproducirConInteraccion = () => {
      void reproducir();
      window.removeEventListener("click", reproducirConInteraccion);
      window.removeEventListener("keydown", reproducirConInteraccion);
      window.removeEventListener("touchstart", reproducirConInteraccion);
    };

    window.addEventListener("click", reproducirConInteraccion);
    window.addEventListener("keydown", reproducirConInteraccion);
    window.addEventListener("touchstart", reproducirConInteraccion);

    return () => {
      window.removeEventListener("click", reproducirConInteraccion);
      window.removeEventListener("keydown", reproducirConInteraccion);
      window.removeEventListener("touchstart", reproducirConInteraccion);
    };
  }, []);

  useEffect(() => {
    void reproducir();
  }, [pistaIndex]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (sonando) {
      audio.pause();
    } else {
      void reproducir();
    }
  };

  const siguiente = () => {
    setPistaIndex((actual) => (actual + 1) % PISTAS.length);
  };

  const anterior = () => {
    setPistaIndex((actual) =>
      actual === 0 ? PISTAS.length - 1 : actual - 1
    );
  };

  const nombrePista = PISTAS[pistaIndex]
    .replace("/musica/", "")
    .replace(".mp3", "");

  const botonClase =
    "w-11 h-11 rounded-full text-white font-black shadow-xl border-2 border-white/30 bg-[linear-gradient(135deg,#d90429,#f9c80e,#00a878,#2563eb)] hover:scale-110 hover:brightness-110 transition";

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      <audio
        ref={audioRef}
        src={PISTAS[pistaIndex]}
        onPlay={() => setSonando(true)}
        onPause={() => setSonando(false)}
        onEnded={siguiente}
      />

      <div className="hidden sm:block max-w-44 truncate rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-900 shadow-xl border-2 border-yellow-300">
        {nombrePista}
      </div>

      <button onClick={anterior} className={botonClase} title="Canción anterior">
        ⏮️
      </button>

      <button
        onClick={toggle}
        className={botonClase}
        title={sonando ? "Pausar" : "Reproducir"}
      >
        {sonando ? "⏸️" : "▶️"}
      </button>

      <button onClick={siguiente} className={botonClase} title="Canción siguiente">
        ⏭️
      </button>
    </div>
  );
}