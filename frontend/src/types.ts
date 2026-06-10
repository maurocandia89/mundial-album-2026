export type Figurita = {
  id: number;
  numero: number;
  nombre: string;
  tipo: "JUGADOR" | "ESCUDO" | "ESTADIO" | "TROFEO" | "PREMIUM" | "EXTRA";
  imagenUrl: string | null;
  seleccionId: number | null;
};

export type Seleccion = {
  id: number;
  nombre: string;
  grupo: string;
  colorPrimario: string;
  colorSecundario: string;
  codigoPais?: string | null;
  escudoUrl: string | null;
  orden: number;
  figuritas: Figurita[];
};

export type ColeccionItem = {
  figuritaId: number;
  tenida: boolean;
  repetidas: number;
};

export type Usuario = { id: string; email: string; nombre: string };