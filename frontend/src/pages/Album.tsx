import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useAlbum } from "../store/album";
import { urlEscudo } from "../lib/escudos";
import Musica from "../components/Musica";

// function banderaEmoji(codigo?: string | null) {
//   if (!codigo) return "🏳️";

//   const especiales: Record<string, string> = {
//     "GB-ENG": "🏴",
//     "GB-SCT": "🏴",
//   };

//   if (especiales[codigo]) return especiales[codigo];

//   return codigo
//     .toUpperCase()
//     .replace(/./g, (char) =>
//       String.fromCodePoint(127397 + char.charCodeAt(0))
//     );
// }

function banderaUrl(codigo?: string | null) {
  if (!codigo) return null;

  return `https://flagcdn.com/${codigo.toLowerCase()}.svg`;
}

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Album() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { selecciones, tenidas, cargando, cargar, toggle } = useAlbum();

  const [busqueda, setBusqueda] = useState("");
  const seccionesRef = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Bloquear el botón "atrás"
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const onPop = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const global = useMemo(() => {
    const total = selecciones.reduce((a, s) => a + s.figuritas.length, 0);
    const tengo = selecciones.reduce(
      (a, s) => a + s.figuritas.filter((f) => tenidas.has(f.id)).length,
      0
    );
    return { tengo, total };
  }, [selecciones, tenidas]);

  const resultadosBusqueda = useMemo(() => {
    const texto = normalizarTexto(busqueda.trim());

    if (!texto) return selecciones;

    return selecciones.filter((sel) =>
      normalizarTexto(sel.nombre).includes(texto)
    );
  }, [busqueda, selecciones]);

  const onToggle = useCallback(
    async (figuritaId: number) => {
      await toggle(figuritaId);
    },
    [toggle]
  );

  const irASeleccion = (seleccionId: number) => {
    const seccion = seccionesRef.current[seleccionId];

    if (seccion) {
      seccion.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setBusqueda("");
  };

  const salir = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <img
            src="/pelota2.png"
            alt=""
            className="w-16 h-16 mx-auto mb-3 animate-spin rounded-full"
          />
          Cargando álbum...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Musica />

      <div className="flex justify-between items-center px-4 py-3 bg-black/30 backdrop-blur text-white sticky top-0 z-40">
        <span className="font-bold flex items-center gap-2">
          <img src="/logo.png" alt="" className="w-6 h-6 rounded-full" />
          Mundial 2026
        </span>

        <div className="flex items-center gap-3 text-sm">
          <span>{usuario?.nombre}</span>
          <span className="opacity-70">
            Total: {global.tengo}/{global.total}
          </span>
          <button onClick={salir} className="text-amber-300">
            Salir
          </button>
        </div>
      </div>

      <div className="sticky top-[52px] z-30 bg-slate-950/90 backdrop-blur border-y border-white/10 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar selección por país..."
            className="w-full rounded-lg bg-white text-slate-900 px-4 py-3 text-sm font-semibold outline-none border-2 border-transparent focus:border-amber-400"
          />

          {busqueda.trim() && (
            <div className="mt-2 bg-slate-900 border border-white/10 rounded-lg overflow-hidden shadow-xl max-h-72 overflow-y-auto">
              {resultadosBusqueda.length > 0 ? (
                resultadosBusqueda.map((sel) => {
                  const total = sel.figuritas.length;
                  const tengo = sel.figuritas.filter((f) =>
                    tenidas.has(f.id)
                  ).length;
                  // const bandera =
                  //   sel.nombre === "Especiales"
                  //     ? "⭐"
                  //     : banderaEmoji(sel.codigoPais);

                  const bandera = banderaUrl(sel.codigoPais);

                  return (
                    <button
                      key={sel.id}
                      type="button"
                      onClick={() => irASeleccion(sel.id)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/10 transition"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        {/* <span className="text-2xl shrink-0">{bandera}</span> */}
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow overflow-hidden">
                        {sel.nombre === "Especiales" || !bandera ? (
                          <span className="text-xl">★</span>
                        ) : (
                          <img
                            src={bandera}
                            alt={sel.nombre}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                      </span>
                        <span className="text-white font-bold truncate">
                          {sel.nombre}
                        </span>
                      </span>

                      <span className="text-xs text-white/60 shrink-0">
                        {tengo}/{total}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-white/60">
                  No encontré esa selección
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        {selecciones.map((sel, idx) => {
          const total = sel.figuritas.length;
          const tengo = sel.figuritas.filter((f) => tenidas.has(f.id)).length;
          const porcentaje = Math.round((tengo / total) * 100);
          const escudo = urlEscudo(sel.nombre);

          return (
            <div
              key={sel.id || idx}
              ref={(el) => {
                seccionesRef.current[sel.id] = el;
              }}
              className="min-h-screen transition-colors duration-500 py-6 scroll-mt-32"
              style={{
                background: `linear-gradient(160deg, ${sel.colorPrimario} 0%, #0f172a 70%)`,
              }}
            >
              <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-white/70 text-sm">
                        {sel.grupo === "★" ? "Especiales" : `Grupo ${sel.grupo}`}
                      </p>
                      <h2 className="text-3xl font-black text-white">
                        {sel.nombre}
                      </h2>
                    </div>

                    {escudo ? (
                      <img
                        src={escudo}
                        alt={sel.nombre}
                        className="w-16 h-16 rounded-full object-contain bg-white/90 border-4 p-1 shadow-lg"
                        style={{ borderColor: sel.colorSecundario }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-xl overflow-hidden bg-white"
                        style={{
                          borderColor: sel.colorSecundario,
                          color: "white",
                          backgroundColor: sel.colorPrimario,
                        }}
                      >
                     {sel.nombre === "Especiales" ? (
                          "★"
                        ) : banderaUrl(sel.codigoPais) ? (
                          <img
                            src={banderaUrl(sel.codigoPais)!}
                            alt={sel.nombre}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          sel.nombre.slice(0, 3).toUpperCase()
                        )}


                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-white text-sm mb-1">
                      <span>
                        {tengo} de {total}
                      </span>
                      <span>{porcentaje}%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {sel.figuritas.map((f) => {
                      const tengo = tenidas.has(f.id);
                      const icono =
                        f.tipo === "ESCUDO"
                          ? "🛡️"
                          : f.tipo === "PREMIUM"
                            ? "⭐"
                            : f.tipo === "EXTRA"
                              ? "🎟️"
                              : "👤";
                      const esEspecial =
                        f.tipo === "EXTRA" || f.tipo === "PREMIUM";

                      return (
                        <button
                          key={f.id}
                          onClick={() => onToggle(f.id)}
                          className={`aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center text-center p-1 transition transform hover:scale-105 ${
                            tengo
                              ? "border-amber-400 shadow-lg"
                              : "border-dashed border-white/30 bg-black/20"
                          }`}
                          style={
                            tengo ? { backgroundColor: sel.colorPrimario } : {}
                          }
                        >
                          {tengo ? (
                            <>
                              <span className="text-2xl">{icono}</span>
                              <span className="text-[10px] text-white font-semibold leading-tight mt-1">
                                {esEspecial ? f.nombre : `#${f.numero}`}
                              </span>
                            </>
                          ) : (
                            <span className="text-white/40 text-sm font-bold">
                              {esEspecial ? f.nombre : `#${f.numero}`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col items-center mt-5 gap-2 text-white/50 text-xs">
                  <span>
                    {idx + 1} / {selecciones.length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}