-- CreateEnum
CREATE TYPE "EstadoATM" AS ENUM ('DISPONIVEL', 'INDISPONIVEL', 'MANUTENCAO');

-- CreateEnum
CREATE TYPE "TipoServico" AS ENUM ('DEPOSITOS', 'ATENDIMENTO');

-- CreateEnum
CREATE TYPE "EstadoServico" AS ENUM ('ABERTO', 'FECHADO');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO');

-- CreateTable
CREATE TABLE "filiais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilizadores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilizadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atms" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "estado" "EstadoATM" NOT NULL DEFAULT 'DISPONIVEL',
    "filialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "tipo" "TipoServico" NOT NULL,
    "estado" "EstadoServico" NOT NULL DEFAULT 'FECHADO',
    "filialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" TEXT NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaAbertura" TEXT NOT NULL,
    "horaFecho" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filiais_nome_key" ON "filiais"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "filiais_codigo_key" ON "filiais"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "utilizadores_username_key" ON "utilizadores"("username");

-- CreateIndex
CREATE INDEX "utilizadores_filialId_idx" ON "utilizadores"("filialId");

-- CreateIndex
CREATE INDEX "atms_filialId_idx" ON "atms"("filialId");

-- CreateIndex
CREATE UNIQUE INDEX "atms_filialId_numero_key" ON "atms"("filialId", "numero");

-- CreateIndex
CREATE INDEX "servicos_filialId_idx" ON "servicos"("filialId");

-- CreateIndex
CREATE UNIQUE INDEX "servicos_filialId_tipo_key" ON "servicos"("filialId", "tipo");

-- CreateIndex
CREATE INDEX "horarios_servicoId_idx" ON "horarios"("servicoId");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_servicoId_diaSemana_key" ON "horarios"("servicoId", "diaSemana");

-- AddForeignKey
ALTER TABLE "utilizadores" ADD CONSTRAINT "utilizadores_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atms" ADD CONSTRAINT "atms_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
