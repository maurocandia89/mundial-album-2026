import { useNavigate } from "react-router-dom";

export default function Bienvenida() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-white px-6"
style={{
  backgroundImage:
    "linear-gradient(rgba(15,23,42,0.7), rgba(2,6,23,0.95)), url('/estadio2.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
}}
    >
      {/* Destellos de fondo */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)",
        }}
      />

      {/* Balón */}
      <div className="text-7xl mb-2 animate-bounce">⚽</div>

      <p className="tracking-[0.4em] text-amber-400 font-semibold text-sm mb-2">
        FIFA WORLD CUP
      </p>
      <h1 className="text-5xl md:text-7xl font-black text-center leading-none mb-1">
        MUNDIAL 2026
      </h1>
      <p className="text-slate-300 text-center mb-1">USA · México · Canadá</p>
      <p className="text-slate-400 text-center text-sm mb-10">
        Tu álbum de figuritas · 48 selecciones · 980 cromos
      </p>

      <button
        onClick={() => navigate("/login")}
        className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-lg px-10 py-4 rounded-full shadow-lg transition transform hover:scale-105 z-10"
      >
        Abrir mi álbum
      </button>

      <p className="absolute bottom-4 text-slate-500 text-xs">
        Proyecto personal · No afiliado a FIFA ni Panini
      </p>
    </div>
  );
}
