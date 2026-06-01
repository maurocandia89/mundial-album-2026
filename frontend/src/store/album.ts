import { create } from "zustand";
import { api } from "../lib/api";
import type { Seleccion, ColeccionItem } from "../types";

type AlbumState = {
  selecciones: Seleccion[];
  tenidas: Set<number>; // ids de figuritas que tengo
  cargando: boolean;
  cargar: () => Promise<void>;
  toggle: (figuritaId: number) => Promise<void>;
};

export const useAlbum = create<AlbumState>((set, get) => ({
  selecciones: [],
  tenidas: new Set(),
  cargando: true,

  cargar: async () => {
    set({ cargando: true });
    const [selRes, colRes] = await Promise.all([
      api.get<Seleccion[]>("/selecciones"),
      api.get<ColeccionItem[]>("/coleccion"),
    ]);
    const tenidas = new Set(
      colRes.data.filter((c) => c.tenida).map((c) => c.figuritaId)
    );
    set({ selecciones: selRes.data, tenidas, cargando: false });
  },

  toggle: async (figuritaId) => {
    const tenidas = new Set(get().tenidas);
    const ahora = !tenidas.has(figuritaId);
    if (ahora) tenidas.add(figuritaId);
    else tenidas.delete(figuritaId);
    set({ tenidas }); // optimista: actualizo ya

    try {
      await api.put(`/coleccion/${figuritaId}`, { tenida: ahora });
    } catch {
      // si falla, revierto
      const revert = new Set(get().tenidas);
      if (ahora) revert.delete(figuritaId);
      else revert.add(figuritaId);
      set({ tenidas: revert });
    }
  },
}));