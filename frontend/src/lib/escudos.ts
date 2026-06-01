// Mapa: nombre exacto de la selección (como está en la base) -> ruta del escudo.
// IMPORTANTE: los archivos en public/escudos/ deben tener nombres SIN tildes ni ñ.
export const ESCUDOS: Record<string, string> = {
  // Grupo A
  "México": "/escudos/mexico.png",
  "Sudáfrica": "/escudos/sudafrica.png",
  "Corea del Sur": "/escudos/corea-del-sur.png",
  "República Checa": "/escudos/republica-checa.png",
  // Grupo B
  "Canadá": "/escudos/canada.png",
  "Qatar": "/escudos/qatar.png",
  "Suiza": "/escudos/suiza.png",
  "Bosnia y Herzegovina": "/escudos/bosnia.png",
  // Grupo C
  "Brasil": "/escudos/brasil.png",
  "Marruecos": "/escudos/marruecos.png",
  "Haití": "/escudos/haiti.png",
  "Escocia": "/escudos/escocia.png",
  // Grupo D
  "Estados Unidos": "/escudos/estados-unidos.png",
  "Paraguay": "/escudos/paraguay.png",
  "Australia": "/escudos/australia.png",
  "Turquía": "/escudos/turquia.png",
  // Grupo E
  "Alemania": "/escudos/alemania.png",
  "Curazao": "/escudos/curazao.png",
  "Costa de Marfil": "/escudos/costa-de-marfil.png",
  "Ecuador": "/escudos/ecuador.png",
  // Grupo F
  "Países Bajos": "/escudos/paises-bajos.png",
  "Japón": "/escudos/japon.png",
  "Túnez": "/escudos/tunez.png",
  "Suecia": "/escudos/suecia.png",
  // Grupo G
  "Bélgica": "/escudos/belgica.png",
  "Egipto": "/escudos/egipto.png",
  "Irán": "/escudos/iran.png",
  "Nueva Zelanda": "/escudos/nueva-zelanda.png",
  // Grupo H
  "España": "/escudos/espana.png",
  "Cabo Verde": "/escudos/cabo-verde.png",
  "Arabia Saudita": "/escudos/arabia-saudita.png",
  "Uruguay": "/escudos/uruguay.png",
  // Grupo I
  "Francia": "/escudos/francia.png",
  "Senegal": "/escudos/senegal.png",
  "Noruega": "/escudos/noruega.png",
  "Iraq": "/escudos/iraq.png",
  // Grupo J
  "Argentina": "/escudos/argentina.png",
  "Argelia": "/escudos/argelia.png",
  "Austria": "/escudos/austria.png",
  "Jordania": "/escudos/jordania.png",
  // Grupo K
  "Portugal": "/escudos/portugal.png",
  "Uzbekistán": "/escudos/uzbekistan.png",
  "Colombia": "/escudos/colombia.png",
  "Congo DR": "/escudos/congo.png",
  // Grupo L
  "Inglaterra": "/escudos/inglaterra.png",
  "Croacia": "/escudos/croacia.png",
  "Ghana": "/escudos/ghana.png",
  "Panamá": "/escudos/panama.png",
};

export function urlEscudo(nombre: string): string | null {
  return ESCUDOS[nombre] ?? null;
}