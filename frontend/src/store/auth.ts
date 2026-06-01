import { create } from "zustand";
import { api } from "../lib/api";
import type { Usuario } from "../types";

type AuthState = {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, nombre: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  usuario: JSON.parse(localStorage.getItem("usuario") || "null"),
  token: localStorage.getItem("token"),

  login: async (email, password) => {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    set({ token: data.token, usuario: data.usuario });
  },

  register: async (email, nombre, password) => {
    const { data } = await api.post("/register", { email, nombre, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    set({ token: data.token, usuario: data.usuario });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    set({ token: null, usuario: null });
  },
}));