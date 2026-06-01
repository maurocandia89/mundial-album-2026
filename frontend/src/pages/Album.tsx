// import { useEffect, useState, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../store/auth";
// import { useAlbum } from "../store/album";
// import { urlEscudo } from "../lib/escudos";
// import Musica from "../components/Musica";

// export default function Album() {
//   const navigate = useNavigate();
//   const { usuario, logout } = useAuth();
//   const { selecciones, tenidas, cargando, cargar, toggle } = useAlbum();
//   const [pagina, setPagina] = useState(0);
//   const [celebrar, setCelebrar] = useState(false);

//   useEffect(() => {
//     cargar();
//   }, [cargar]);

//   // Bloquear el botón "atrás": al entrar al álbum, empujamos un estado
//   // y si el usuario intenta volver, lo mantenemos en el álbum.
//   useEffect(() => {
//     window.history.pushState(null, "", window.location.href);
//     const onPop = () => {
//       window.history.pushState(null, "", window.location.href);
//     };
//     window.addEventListener("popstate", onPop);
//     return () => window.removeEventListener("popstate", onPop);
//   }, []);

//   const sel = selecciones[pagina];

//   const progreso = useMemo(() => {
//     if (!sel) return { tengo: 0, total: 0 };
//     const total = sel.figuritas.length;
//     const tengo = sel.figuritas.filter((f) => tenidas.has(f.id)).length;
//     return { tengo, total };
//   }, [sel, tenidas]);

//   const global = useMemo(() => {
//     const total = selecciones.reduce((a, s) => a + s.figuritas.length, 0);
//     const tengo = selecciones.reduce(
//       (a, s) => a + s.figuritas.filter((f) => tenidas.has(f.id)).length,
//       0
//     );
//     return { tengo, total };
//   }, [selecciones, tenidas]);

//   const onToggle = useCallback(
//     async (figuritaId: number) => {
//       await toggle(figuritaId);
//       if (!sel) return;
//       const total = sel.figuritas.length;
//       const tengoAhora = sel.figuritas.filter((f) =>
//         f.id === figuritaId ? !tenidas.has(f.id) : tenidas.has(f.id)
//       ).length;
//       if (total > 0 && tengoAhora === total) {
//         setCelebrar(true);
//         setTimeout(() => setCelebrar(false), 2500);
//       }
//     },
//     [toggle, sel, tenidas]
//   );

//   const irA = useCallback(
//     (dir: number) => {
//       setCelebrar(false);
//       setPagina((p) => Math.min(selecciones.length - 1, Math.max(0, p + dir)));
//     },
//     [selecciones.length]
//   );

//   // Flechas izq/der del teclado (en PC) para navegar entre equipos
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "ArrowRight") irA(1);
//       if (e.key === "ArrowLeft") irA(-1);
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [irA]);

//   const salir = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   if (cargando) {
//     return (
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//         <div className="text-center">
//           <img src="/pelota2.png" alt="" className="w-16 h-16 mx-auto mb-3 animate-spin rounded-full" />
//           Cargando álbum...
//         </div>
//       </div>
//     );
//   }

//   if (!sel) return null;

//   const porcentaje = Math.round((progreso.tengo / progreso.total) * 100);
//   const escudo = urlEscudo(sel.nombre);

//   return (
//     <div
//       className="min-h-screen transition-colors duration-500 overflow-y-auto"
//       style={{
//         background: `linear-gradient(160deg, ${sel.colorPrimario} 0%, #0f172a 70%)`,
//       }}
//     >
//       <Musica />

//       <div className="flex justify-between items-center px-4 py-3 bg-black/30 backdrop-blur text-white sticky top-0 z-40">
//         <span className="font-bold flex items-center gap-2">
//           <img src="/logo.png" alt="" className="w-6 h-6 rounded-full" />
//           Mundial 2026
//         </span>
//         <div className="flex items-center gap-3 text-sm">
//           <span>{usuario?.nombre}</span>
//           <span className="opacity-70">
//             Total: {global.tengo}/{global.total}
//           </span>
//           <button onClick={salir} className="text-amber-300">Salir</button>
//         </div>
//       </div>

//       {celebrar && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
//           <div className="bg-amber-400 text-slate-900 font-black text-2xl px-8 py-6 rounded-2xl shadow-2xl animate-bounce text-center">
//             🎉 ¡Completaste {sel.nombre}! 🎉
//             <div className="text-base font-bold mt-1">¡Página llena!</div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-3xl mx-auto px-4 py-6">
//         <div className="bg-white/10 backdrop-blur rounded-2xl p-5 shadow-xl">
//           <div className="flex items-center justify-between mb-1">
//             <div>
//               <p className="text-white/70 text-sm">
//                 {sel.grupo === "★" ? "Especiales" : `Grupo ${sel.grupo}`}
//               </p>
//               <h2 className="text-3xl font-black text-white">{sel.nombre}</h2>
//             </div>

//             {escudo ? (
//               <img
//                 src={escudo}
//                 alt={sel.nombre}
//                 className="w-16 h-16 rounded-full object-contain bg-white/90 border-4 p-1 shadow-lg"
//                 style={{ borderColor: sel.colorSecundario }}
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />
//             ) : (
//               <div
//                 className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-xl"
//                 style={{
//                   borderColor: sel.colorSecundario,
//                   color: "white",
//                   backgroundColor: sel.colorPrimario,
//                 }}
//               >
//                 {sel.nombre === "Especiales" ? "★" : sel.nombre.slice(0, 3).toUpperCase()}
//               </div>
//             )}
//           </div>

//           <div className="mb-4">
//             <div className="flex justify-between text-white text-sm mb-1">
//               <span>{progreso.tengo} de {progreso.total}</span>
//               <span>{porcentaje}%</span>
//             </div>
//             <div className="h-2 bg-black/30 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-amber-400 transition-all duration-300"
//                 style={{ width: `${porcentaje}%` }}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
//             {sel.figuritas.map((f) => {
//               const tengo = tenidas.has(f.id);
//               const icono =
//                 f.tipo === "ESCUDO" ? "🛡️"
//                 : f.tipo === "PREMIUM" ? "⭐"
//                 : f.tipo === "EXTRA" ? "🎟️"
//                 : "👤";
//               const esEspecial = f.tipo === "EXTRA" || f.tipo === "PREMIUM";
//               return (
//                 <button
//                   key={f.id}
//                   onClick={() => onToggle(f.id)}
//                   className={`aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center text-center p-1 transition transform hover:scale-105 ${
//                     tengo
//                       ? "border-amber-400 shadow-lg"
//                       : "border-dashed border-white/30 bg-black/20"
//                   }`}
//                   style={tengo ? { backgroundColor: sel.colorPrimario } : {}}
//                 >
//                   {tengo ? (
//                     <>
//                       <span className="text-2xl">{icono}</span>
//                       <span className="text-[10px] text-white font-semibold leading-tight mt-1">
//                         {esEspecial ? f.nombre : `#${f.numero}`}
//                       </span>
//                     </>
//                   ) : (
//                     <span className="text-white/40 text-sm font-bold">
//                       {esEspecial ? f.nombre : `#${f.numero}`}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="flex flex-col items-center mt-5 gap-3">
//           <span className="text-white/80 text-sm">
//             {pagina + 1} / {selecciones.length}
//           </span>
          
//           {/* Botones de navegación */}
//           <div className="flex gap-3">
//             <button
//               onClick={() => irA(-1)}
//               disabled={pagina === 0}
//               className={`px-4 py-2 rounded-lg font-bold transition ${
//                 pagina === 0
//                   ? "bg-white/20 text-white/50 cursor-not-allowed"
//                   : "bg-amber-400 text-slate-900 hover:bg-amber-300 active:scale-95"
//               }`}
//             >
//               ← Anterior
//             </button>
//             <button
//               onClick={() => irA(1)}
//               disabled={pagina === selecciones.length - 1}
//               className={`px-4 py-2 rounded-lg font-bold transition ${
//                 pagina === selecciones.length - 1
//                   ? "bg-white/20 text-white/50 cursor-not-allowed"
//                   : "bg-amber-400 text-slate-900 hover:bg-amber-300 active:scale-95"
//               }`}
//             >
//               Siguiente →
//             </button>
//           </div>

//           <p className="text-white/50 text-xs">
//             Usa los botones o las flechas ← → del teclado
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../store/auth";
// import { useAlbum } from "../store/album";
// import { urlEscudo } from "../lib/escudos";
// import Musica from "../components/Musica";

// export default function Album() {
//   const navigate = useNavigate();
//   const { usuario, logout } = useAuth();
//   const { selecciones, tenidas, cargando, cargar, toggle } = useAlbum();
//   const [celebrar, setCelebrar] = useState(false);

//   useEffect(() => {
//     cargar();
//   }, [cargar]);

//   // Bloquear el botón "atrás"
//   useEffect(() => {
//     window.history.pushState(null, "", window.location.href);
//     const onPop = () => {
//       window.history.pushState(null, "", window.location.href);
//     };
//     window.addEventListener("popstate", onPop);
//     return () => window.removeEventListener("popstate", onPop);
//   }, []);

//   const global = useMemo(() => {
//     const total = selecciones.reduce((a, s) => a + s.figuritas.length, 0);
//     const tengo = selecciones.reduce(
//       (a, s) => a + s.figuritas.filter((f) => tenidas.has(f.id)).length,
//       0
//     );
//     return { tengo, total };
//   }, [selecciones, tenidas]);

//   const onToggle = useCallback(
//     async (figuritaId: number) => {
//       await toggle(figuritaId);
//       setCelebrar(true);
//       setTimeout(() => setCelebrar(false), 2500);
//     },
//     [toggle]
//   );

//   const salir = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   if (cargando) {
//     return (
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//         <div className="text-center">
//           <img src="/pelota2.png" alt="" className="w-16 h-16 mx-auto mb-3 animate-spin rounded-full" />
//           Cargando álbum...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-900">
//       <Musica />

//       <div className="flex justify-between items-center px-4 py-3 bg-black/30 backdrop-blur text-white sticky top-0 z-40">
//         <span className="font-bold flex items-center gap-2">
//           <img src="/logo.png" alt="" className="w-6 h-6 rounded-full" />
//           Mundial 2026
//         </span>
//         <div className="flex items-center gap-3 text-sm">
//           <span>{usuario?.nombre}</span>
//           <span className="opacity-70">
//             Total: {global.tengo}/{global.total}
//           </span>
//           <button onClick={salir} className="text-amber-300">Salir</button>
//         </div>
//       </div>

//       {celebrar && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
//           <div className="bg-amber-400 text-slate-900 font-black text-2xl px-8 py-6 rounded-2xl shadow-2xl animate-bounce text-center">
//             🎉 ¡Completaste un equipo! 🎉
//             <div className="text-base font-bold mt-1">¡Página llena!</div>
//           </div>
//         </div>
//       )}

//       <div className="w-full">
//         {selecciones.map((sel, idx) => {
//           const total = sel.figuritas.length;
//           const tengo = sel.figuritas.filter((f) => tenidas.has(f.id)).length;
//           const porcentaje = Math.round((tengo / total) * 100);
//           const escudo = urlEscudo(sel.nombre);

//           return (
//             <div
//               key={sel.id || idx}
//               className="min-h-screen transition-colors duration-500 py-6"
//               style={{
//                 background: `linear-gradient(160deg, ${sel.colorPrimario} 0%, #0f172a 70%)`,
//               }}
//             >
//               <div className="max-w-3xl mx-auto px-4">
//                 <div className="bg-white/10 backdrop-blur rounded-2xl p-5 shadow-xl">
//                   <div className="flex items-center justify-between mb-1">
//                     <div>
//                       <p className="text-white/70 text-sm">
//                         {sel.grupo === "★" ? "Especiales" : `Grupo ${sel.grupo}`}
//                       </p>
//                       <h2 className="text-3xl font-black text-white">{sel.nombre}</h2>
//                     </div>

//                     {escudo ? (
//                       <img
//                         src={escudo}
//                         alt={sel.nombre}
//                         className="w-16 h-16 rounded-full object-contain bg-white/90 border-4 p-1 shadow-lg"
//                         style={{ borderColor: sel.colorSecundario }}
//                         onError={(e) => {
//                           (e.currentTarget as HTMLImageElement).style.display = "none";
//                         }}
//                       />
//                     ) : (
//                       <div
//                         className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-xl"
//                         style={{
//                           borderColor: sel.colorSecundario,
//                           color: "white",
//                           backgroundColor: sel.colorPrimario,
//                         }}
//                       >
//                         {sel.nombre === "Especiales" ? "★" : sel.nombre.slice(0, 3).toUpperCase()}
//                       </div>
//                     )}
//                   </div>

//                   <div className="mb-4">
//                     <div className="flex justify-between text-white text-sm mb-1">
//                       <span>{tengo} de {total}</span>
//                       <span>{porcentaje}%</span>
//                     </div>
//                     <div className="h-2 bg-black/30 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-amber-400 transition-all duration-300"
//                         style={{ width: `${porcentaje}%` }}
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
//                     {sel.figuritas.map((f) => {
//                       const tengo = tenidas.has(f.id);
//                       const icono =
//                         f.tipo === "ESCUDO" ? "🛡️"
//                         : f.tipo === "PREMIUM" ? "⭐"
//                         : f.tipo === "EXTRA" ? "🎟️"
//                         : "👤";
//                       const esEspecial = f.tipo === "EXTRA" || f.tipo === "PREMIUM";
//                       return (
//                         <button
//                           key={f.id}
//                           onClick={() => onToggle(f.id)}
//                           className={`aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center text-center p-1 transition transform hover:scale-105 ${
//                             tengo
//                               ? "border-amber-400 shadow-lg"
//                               : "border-dashed border-white/30 bg-black/20"
//                           }`}
//                           style={tengo ? { backgroundColor: sel.colorPrimario } : {}}
//                         >
//                           {tengo ? (
//                             <>
//                               <span className="text-2xl">{icono}</span>
//                               <span className="text-[10px] text-white font-semibold leading-tight mt-1">
//                                 {esEspecial ? f.nombre : `#${f.numero}`}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="text-white/40 text-sm font-bold">
//                               {esEspecial ? f.nombre : `#${f.numero}`}
//                             </span>
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <div className="flex flex-col items-center mt-5 gap-2 text-white/50 text-xs">
//                   <span>
//                     {idx + 1} / {selecciones.length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useAlbum } from "../store/album";
import { urlEscudo } from "../lib/escudos";
import Musica from "../components/Musica";

export default function Album() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { selecciones, tenidas, cargando, cargar, toggle } = useAlbum();
  const [celebrar, setCelebrar] = useState(false);
  const [equipoCompletado, setEquipoCompletado] = useState<number | null>(null);

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

  const onToggle = useCallback(
    async (figuritaId: number) => {
      await toggle(figuritaId);

      // Verificar si se completó algún equipo EN ESTA SESIÓN
      selecciones.forEach((sel) => {
        const total = sel.figuritas.length;
        const tengo = sel.figuritas.filter((f) => tenidas.has(f.id)).length;

        // Si el equipo está completo y no lo habíamos celebrado antes
        if (total > 0 && tengo === total && equipoCompletado !== sel.id) {
          setCelebrar(true);
          setEquipoCompletado(sel.id);
          setTimeout(() => setCelebrar(false), 2500);
        }
      });
    },
    [toggle, selecciones, tenidas, equipoCompletado]
  );

  const salir = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <img src="/pelota2.png" alt="" className="w-16 h-16 mx-auto mb-3 animate-spin rounded-full" />
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
          <button onClick={salir} className="text-amber-300">Salir</button>
        </div>
      </div>

      {celebrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-amber-400 text-slate-900 font-black text-2xl px-8 py-6 rounded-2xl shadow-2xl animate-bounce text-center">
            🎉 ¡Completaste un equipo! 🎉
            <div className="text-base font-bold mt-1">¡Página llena!</div>
          </div>
        </div>
      )}

      <div className="w-full">
        {selecciones.map((sel, idx) => {
          const total = sel.figuritas.length;
          const tengo = sel.figuritas.filter((f) => tenidas.has(f.id)).length;
          const porcentaje = Math.round((tengo / total) * 100);
          const escudo = urlEscudo(sel.nombre);

          return (
            <div
              key={sel.id || idx}
              className="min-h-screen transition-colors duration-500 py-6"
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
                      <h2 className="text-3xl font-black text-white">{sel.nombre}</h2>
                    </div>

                    {escudo ? (
                      <img
                        src={escudo}
                        alt={sel.nombre}
                        className="w-16 h-16 rounded-full object-contain bg-white/90 border-4 p-1 shadow-lg"
                        style={{ borderColor: sel.colorSecundario }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-xl"
                        style={{
                          borderColor: sel.colorSecundario,
                          color: "white",
                          backgroundColor: sel.colorPrimario,
                        }}
                      >
                        {sel.nombre === "Especiales" ? "★" : sel.nombre.slice(0, 3).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-white text-sm mb-1">
                      <span>{tengo} de {total}</span>
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
                        f.tipo === "ESCUDO" ? "🛡️"
                        : f.tipo === "PREMIUM" ? "⭐"
                        : f.tipo === "EXTRA" ? "🎟️"
                        : "👤";
                      const esEspecial = f.tipo === "EXTRA" || f.tipo === "PREMIUM";
                      return (
                        <button
                          key={f.id}
                          onClick={() => onToggle(f.id)}
                          className={`aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center text-center p-1 transition transform hover:scale-105 ${
                            tengo
                              ? "border-amber-400 shadow-lg"
                              : "border-dashed border-white/30 bg-black/20"
                          }`}
                          style={tengo ? { backgroundColor: sel.colorPrimario } : {}}
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