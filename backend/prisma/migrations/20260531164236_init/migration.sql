-- CreateEnum
CREATE TYPE "TipoFigurita" AS ENUM ('JUGADOR', 'ESCUDO', 'ESTADIO', 'TROFEO', 'PREMIUM', 'EXTRA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seleccion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "grupo" TEXT NOT NULL,
    "colorPrimario" TEXT NOT NULL,
    "colorSecundario" TEXT NOT NULL,
    "escudoUrl" TEXT,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Seleccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Figurita" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoFigurita" NOT NULL DEFAULT 'JUGADOR',
    "imagenUrl" TEXT,
    "seleccionId" INTEGER,

    CONSTRAINT "Figurita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coleccion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "figuritaId" INTEGER NOT NULL,
    "tenida" BOOLEAN NOT NULL DEFAULT false,
    "repetidas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Coleccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coleccion_usuarioId_figuritaId_key" ON "Coleccion"("usuarioId", "figuritaId");

-- AddForeignKey
ALTER TABLE "Figurita" ADD CONSTRAINT "Figurita_seleccionId_fkey" FOREIGN KEY ("seleccionId") REFERENCES "Seleccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coleccion" ADD CONSTRAINT "Coleccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coleccion" ADD CONSTRAINT "Coleccion_figuritaId_fkey" FOREIGN KEY ("figuritaId") REFERENCES "Figurita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
