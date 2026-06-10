import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async () => {
    setError("");
    setCargando(true);

    try {
      if (modo === "login") {
        await login(email, password);
      } else {
        await register(email, nombre, password);
      }

      navigate("/album", { replace: true });
    } catch (e) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || "Error al conectar");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fondos/login-bg.png')" }}
    >
      <div className="min-h-screen flex items-center justify-center px-6 bg-black/55 backdrop-blur-[1px]">
        <div className="w-full max-w-md rounded-2xl border-2 border-white/25 bg-slate-950/80 p-8 shadow-2xl backdrop-blur">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl border-4 border-yellow-300">
              <img src="/pelota.png" alt="" className="w-12 h-12 rounded-full" />
            </div>

            <p className="text-xs font-black uppercase tracking-wide text-yellow-300">
              Mundial Album 2026
            </p>

            <h1 className="text-3xl font-black text-white">
              {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h1>
          </div>

          {modo === "registro" && (
            <input
              className="w-full mb-3 px-4 py-3 rounded-xl bg-white/95 text-slate-900 border-2 border-transparent focus:border-yellow-300 focus:ring-4 focus:ring-yellow-300/30 outline-none font-semibold"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          )}

          <input
            className="w-full mb-3 px-4 py-3 rounded-xl bg-white/95 text-slate-900 border-2 border-transparent focus:border-yellow-300 focus:ring-4 focus:ring-yellow-300/30 outline-none font-semibold"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/95 text-slate-900 border-2 border-transparent focus:border-yellow-300 focus:ring-4 focus:ring-yellow-300/30 outline-none font-semibold"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
          />

          {error && (
            <p className="mb-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-100 border border-red-300/30">
              {error}
            </p>
          )}

          <button
            onClick={enviar}
            disabled={cargando}
            className="w-full rounded-xl bg-[linear-gradient(135deg,#d90429,#f9c80e,#00a878,#2563eb)] py-3 font-black text-white shadow-xl border-2 border-white/25 transition hover:scale-[1.02] hover:brightness-110 disabled:opacity-50"
          >
            {cargando ? "..." : modo === "login" ? "Entrar" : "Registrarme"}
          </button>

          <p className="text-white/80 text-center text-sm mt-5">
            {modo === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
            <button
              type="button"
              className="font-black text-yellow-300 hover:text-yellow-200"
              onClick={() => {
                setModo(modo === "login" ? "registro" : "login");
                setError("");
              }}
            >
              {modo === "login" ? "Registrate" : "Iniciá sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}