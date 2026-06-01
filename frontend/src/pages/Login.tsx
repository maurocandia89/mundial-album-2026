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
      navigate("/album");
   } catch (e) {
  const err = e as { response?: { data?: { error?: string } } };
  setError(err.response?.data?.error || "Error al conectar");
} finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "radial-gradient(circle at 50% 20%, #1e3a8a 0%, #0f172a 60%, #020617 100%)" }}
    >
      <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-700">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚽</div>
          <h1 className="text-2xl font-bold text-white">
            {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
        </div>

        {modo === "registro" && (
          <input
            className="w-full mb-3 px-4 py-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:border-amber-400 outline-none"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        )}
        <input
          className="w-full mb-3 px-4 py-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:border-amber-400 outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-4 px-4 py-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:border-amber-400 outline-none"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={enviar}
          disabled={cargando}
          className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-900 font-bold py-3 rounded-lg transition"
        >
          {cargando ? "..." : modo === "login" ? "Entrar" : "Registrarme"}
        </button>

        <p className="text-slate-400 text-center text-sm mt-4">
          {modo === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            className="text-amber-400 font-semibold"
            onClick={() => { setModo(modo === "login" ? "registro" : "login"); setError(""); }}
          >
            {modo === "login" ? "Registrate" : "Iniciá sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}