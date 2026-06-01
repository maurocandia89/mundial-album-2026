import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./db.js";

const app = express();

const ORIGENES_PERMITIDOS = [
  "http://localhost:5173",
  "https://mundial-album-2026.vercel.app",
];

app.use(
  cors({
    origin: ORIGENES_PERMITIDOS,
    credentials: true,
  })
);

app.use(express.json());
app.get("/", (_req, res) => {
  res.json({ ok: true, mensaje: "API Mundial Álbum funcionando" });
});

const JWT_SECRET = process.env.JWT_SECRET!;

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

// --- AUTH ---
app.post("/api/register", async (req, res) => {
  const { email, nombre, password } = req.body;
  if (!email || !nombre || !password)
    return res.status(400).json({ error: "Faltan datos" });
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) return res.status(409).json({ error: "Email ya registrado" });
  const hash = await bcrypt.hash(password, 10);
  const usuario = await prisma.usuario.create({
    data: { email, nombre, password: hash },
  });
  const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, usuario: { id: usuario.id, email, nombre } });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });
  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });
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

// Marcar/desmarcar una figurita (toggle o set explícito)
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
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));