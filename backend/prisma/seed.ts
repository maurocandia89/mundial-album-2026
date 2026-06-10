import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("Falta DIRECT_URL / DATABASE_URL");

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

type SelData = {
  nombre: string;
  grupo: string;
  colorPrimario: string;
  colorSecundario: string;
  codigoPais: string;
};

const SELECCIONES: SelData[] = [
  // GRUPO A
  { nombre: "México", grupo: "A", colorPrimario: "#006847", colorSecundario: "#FFFFFF", codigoPais: "MX" },
  { nombre: "Sudáfrica", grupo: "A", colorPrimario: "#007A4D", colorSecundario: "#FFB915", codigoPais: "ZA" },
  { nombre: "Corea del Sur", grupo: "A", colorPrimario: "#C60C30", colorSecundario: "#003478", codigoPais: "KR" },
  { nombre: "República Checa", grupo: "A", colorPrimario: "#475569", colorSecundario: "#FFFFFF", codigoPais: "CZ" },

  // GRUPO B
  { nombre: "Canadá", grupo: "B", colorPrimario: "#FF0000", colorSecundario: "#FFFFFF", codigoPais: "CA" },
  { nombre: "Bosnia y Herzegovina", grupo: "B", colorPrimario: "#475569", colorSecundario: "#FFFFFF", codigoPais: "BA" },
  { nombre: "Qatar", grupo: "B", colorPrimario: "#8A1538", colorSecundario: "#FFFFFF", codigoPais: "QA" },
  { nombre: "Suiza", grupo: "B", colorPrimario: "#D52B1E", colorSecundario: "#FFFFFF", codigoPais: "CH" },

  // GRUPO C
  { nombre: "Brasil", grupo: "C", colorPrimario: "#FEDF00", colorSecundario: "#009C3B", codigoPais: "BR" },
  { nombre: "Marruecos", grupo: "C", colorPrimario: "#C1272D", colorSecundario: "#006233", codigoPais: "MA" },
  { nombre: "Haití", grupo: "C", colorPrimario: "#00209F", colorSecundario: "#D21034", codigoPais: "HT" },
  { nombre: "Escocia", grupo: "C", colorPrimario: "#005EB8", colorSecundario: "#FFFFFF", codigoPais: "GB-SCT" },

  // GRUPO D
  { nombre: "Estados Unidos", grupo: "D", colorPrimario: "#0A3161", colorSecundario: "#B31942", codigoPais: "US" },
  { nombre: "Paraguay", grupo: "D", colorPrimario: "#D52B1E", colorSecundario: "#0038A8", codigoPais: "PY" },
  { nombre: "Australia", grupo: "D", colorPrimario: "#00843D", colorSecundario: "#FFCD00", codigoPais: "AU" },
  { nombre: "Turquía", grupo: "D", colorPrimario: "#475569", colorSecundario: "#FFFFFF", codigoPais: "TR" },

  // GRUPO E
  { nombre: "Alemania", grupo: "E", colorPrimario: "#000000", colorSecundario: "#DD0000", codigoPais: "DE" },
  { nombre: "Curazao", grupo: "E", colorPrimario: "#002B7F", colorSecundario: "#FFD100", codigoPais: "CW" },
  { nombre: "Costa de Marfil", grupo: "E", colorPrimario: "#FF8200", colorSecundario: "#009E60", codigoPais: "CI" },
  { nombre: "Ecuador", grupo: "E", colorPrimario: "#FFD100", colorSecundario: "#0033A0", codigoPais: "EC" },

  // GRUPO F
  { nombre: "Países Bajos", grupo: "F", colorPrimario: "#FF6200", colorSecundario: "#FFFFFF", codigoPais: "NL" },
  { nombre: "Japón", grupo: "F", colorPrimario: "#000080", colorSecundario: "#FFFFFF", codigoPais: "JP" },
  { nombre: "Suecia", grupo: "F", colorPrimario: "#475569", colorSecundario: "#FFFFFF", codigoPais: "SE" },
  { nombre: "Túnez", grupo: "F", colorPrimario: "#E70013", colorSecundario: "#FFFFFF", codigoPais: "TN" },

  // GRUPO G
  { nombre: "Bélgica", grupo: "G", colorPrimario: "#E30613", colorSecundario: "#FDDA24", codigoPais: "BE" },
  { nombre: "Egipto", grupo: "G", colorPrimario: "#CE1126", colorSecundario: "#000000", codigoPais: "EG" },
  { nombre: "Irán", grupo: "G", colorPrimario: "#239F40", colorSecundario: "#DA0000", codigoPais: "IR" },
  { nombre: "Nueva Zelanda", grupo: "G", colorPrimario: "#000000", colorSecundario: "#FFFFFF", codigoPais: "NZ" },

  // GRUPO H
  { nombre: "España", grupo: "H", colorPrimario: "#C60B1E", colorSecundario: "#FFC400", codigoPais: "ES" },
  { nombre: "Cabo Verde", grupo: "H", colorPrimario: "#003893", colorSecundario: "#CF2027", codigoPais: "CV" },
  { nombre: "Arabia Saudita", grupo: "H", colorPrimario: "#006C35", colorSecundario: "#FFFFFF", codigoPais: "SA" },
  { nombre: "Uruguay", grupo: "H", colorPrimario: "#4AABDD", colorSecundario: "#FFFFFF", codigoPais: "UY" },

  // GRUPO I
  { nombre: "Francia", grupo: "I", colorPrimario: "#002654", colorSecundario: "#FFFFFF", codigoPais: "FR" },
  { nombre: "Senegal", grupo: "I", colorPrimario: "#00853F", colorSecundario: "#FDEF42", codigoPais: "SN" },
  { nombre: "Iraq", grupo: "I", colorPrimario: "#475569", colorSecundario: "#FFFFFF", codigoPais: "IQ" },
  { nombre: "Noruega", grupo: "I", colorPrimario: "#EF2B2D", colorSecundario: "#002868", codigoPais: "NO" },

  // GRUPO J
  { nombre: "Argentina", grupo: "J", colorPrimario: "#75AADB", colorSecundario: "#FFFFFF", codigoPais: "AR" },
  { nombre: "Argelia", grupo: "J", colorPrimario: "#006233", colorSecundario: "#FFFFFF", codigoPais: "DZ" },
  { nombre: "Austria", grupo: "J", colorPrimario: "#ED2939", colorSecundario: "#FFFFFF", codigoPais: "AT" },
  { nombre: "Jordania", grupo: "J", colorPrimario: "#000000", colorSecundario: "#CE1126", codigoPais: "JO" },

  // GRUPO K
  { nombre: "Portugal", grupo: "K", colorPrimario: "#006600", colorSecundario: "#FF0000", codigoPais: "PT" },
  { nombre: "Congo DR", grupo: "K", colorPrimario: "#475569", colorSecundario: "#FFFFFF", codigoPais: "CD" },
  { nombre: "Uzbekistán", grupo: "K", colorPrimario: "#1EB53A", colorSecundario: "#0099B5", codigoPais: "UZ" },
  { nombre: "Colombia", grupo: "K", colorPrimario: "#FCD116", colorSecundario: "#003893", codigoPais: "CO" },

  // GRUPO L
  { nombre: "Inglaterra", grupo: "L", colorPrimario: "#FFFFFF", colorSecundario: "#CE1124", codigoPais: "GB-ENG" },
  { nombre: "Croacia", grupo: "L", colorPrimario: "#FF0000", colorSecundario: "#FFFFFF", codigoPais: "HR" },
  { nombre: "Ghana", grupo: "L", colorPrimario: "#006B3F", colorSecundario: "#FCD116", codigoPais: "GH" },
  { nombre: "Panamá", grupo: "L", colorPrimario: "#005293", colorSecundario: "#DA121A", codigoPais: "PA" },
];

async function main() {
  console.log(`Seed: ${SELECCIONES.length} selecciones + especiales`);

  await prisma.coleccion.deleteMany();
  await prisma.figurita.deleteMany();
  await prisma.seleccion.deleteMany();

  for (let i = 0; i < SELECCIONES.length; i++) {
    const s = SELECCIONES[i]!;

    const seleccion = await prisma.seleccion.create({
      data: {
        nombre: s.nombre,
        grupo: s.grupo,
        colorPrimario: s.colorPrimario,
        colorSecundario: s.colorSecundario,
        codigoPais: s.codigoPais,
        escudoUrl: null,
        orden: i + 1,
      },
    });

    await prisma.figurita.create({
      data: {
        numero: 1,
        nombre: `Escudo ${s.nombre}`,
        tipo: "ESCUDO",
        seleccionId: seleccion.id,
      },
    });

    for (let n = 2; n <= 20; n++) {
      await prisma.figurita.create({
        data: {
          numero: n,
          nombre: `${s.nombre} - Jugador ${n - 1}`,
          tipo: "JUGADOR",
          seleccionId: seleccion.id,
        },
      });
    }
  }

  const especiales = await prisma.seleccion.create({
    data: {
      nombre: "Especiales",
      grupo: "★",
      colorPrimario: "#7C3AED",
      colorSecundario: "#FBBF24",
      codigoPais: null,
      escudoUrl: null,
      orden: 100,
    },
  });

  await prisma.figurita.create({
    data: {
      numero: 0,
      nombre: "Panini 00",
      tipo: "PREMIUM",
      seleccionId: especiales.id,
    },
  });

  for (let n = 1; n <= 8; n++) {
    await prisma.figurita.create({
      data: {
        numero: 100 + n,
        nombre: `FWC ${n}`,
        tipo: "EXTRA",
        seleccionId: especiales.id,
      },
    });
  }

  for (let n = 1; n <= 14; n++) {
    await prisma.figurita.create({
      data: {
        numero: 200 + n,
        nombre: `CC${n}`,
        tipo: "EXTRA",
        seleccionId: especiales.id,
      },
    });
  }

  const totalSel = await prisma.seleccion.count();
  const totalFig = await prisma.figurita.count();

  console.log(`Listo. Selecciones: ${totalSel} · Figuritas: ${totalFig}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });