import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./db.js";

const app = express();

// CORS: permitimos localhost (dev) y la app en Vercel (prod)
const ORIGENES_PERMITIDOS = [
  "http://localhost:5173",
  "https://mundial-album-2026.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // permitir requests sin origin (curl, apps móviles) y los de la lista
      if (!origin || ORIGENES_PERMITIDOS.includes(origin)) {
        callback(null, true);
      } else if (origin.endsWith(".vercel.app")) {
        // permitir también los previews de Vercel del proyecto
        callback(null, true);
      } else {
        callback(new Error("Origen no permitido por CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET!;

// --- Validaciones ---
function emailValido(email: string): boolean {
  // formato básico: algo@algo.algo
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Middleware de auth
function auth(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Sin token" });
  try {
    const token = header.split(" ")[1];
    req.usuario = jwt.verify(token, JWT_SECRET) as { id: string };
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

app.get("/", (_req, res) => {
  res.json({ ok: true, mensaje: "API Mundial Álbum funcionando" });
});

// --- AUTH ---
app.post("/api/register", async (req, res) => {
  const nombre = String(req.body.nombre ?? "").trim();
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");

  if (!email || !nombre || !password)
    return res.status(400).json({ error: "Completá todos los campos" });
  if (nombre.length < 2)
    return res.status(400).json({ error: "El nombre es muy corto" });
  if (!emailValido(email))
    return res.status(400).json({ error: "El email no tiene un formato válido" });
  if (password.length < 6)
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) return res.status(409).json({ error: "Ese email ya está registrado" });

  const hash = await bcrypt.hash(password, 10);
  const usuario = await prisma.usuario.create({
    data: { email, nombre, password: hash },
  });
  const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, usuario: { id: usuario.id, email, nombre } });
});

app.post("/api/login", async (req, res) => {
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");

  if (!email || !password)
    return res.status(400).json({ error: "Completá email y contraseña" });
  if (!emailValido(email))
    return res.status(400).json({ error: "El email no tiene un formato válido" });

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return res.status(401).json({ error: "Email o contraseña incorrectos" });
  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) return res.status(401).json({ error: "Email o contraseña incorrectos" });

  const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: "30d" });
  res.json({
    token,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
  });
});

// --- SELECCIONES + FIGURITAS ---
app.get("/api/selecciones", async (_req, res) => {
  const selecciones = await prisma.seleccion.findMany({
    orderBy: { orden: "asc" },
    include: { figuritas: { orderBy: { numero: "asc" } } },
  });
  res.json(selecciones);
});

// --- COLECCIÓN DEL USUARIO ---
app.get("/api/coleccion", auth, async (req: any, res) => {
  const coleccion = await prisma.coleccion.findMany({
    where: { usuarioId: req.usuario.id },
  });
  res.json(coleccion);
});

app.put("/api/coleccion/:figuritaId", auth, async (req: any, res) => {
  const figuritaId = Number(req.params.figuritaId);
  const { tenida, repetidas } = req.body;
  const registro = await prisma.coleccion.upsert({
    where: {
      usuarioId_figuritaId: { usuarioId: req.usuario.id, figuritaId },
    },
    update: {
      ...(tenida !== undefined && { tenida }),
      ...(repetidas !== undefined && { repetidas }),
    },
    create: {
      usuarioId: req.usuario.id,
      figuritaId,
      tenida: tenida ?? true,
      repetidas: repetidas ?? 0,
    },
  });
  res.json(registro);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API en puerto ${PORT}`));