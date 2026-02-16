/*
  Warnings:

  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `barbershops` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cancellations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_clientId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "cancellations" DROP CONSTRAINT "cancellations_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_barbershopId_fkey";

-- DropTable
DROP TABLE "appointments";

-- DropTable
DROP TABLE "availability";

-- DropTable
DROP TABLE "barbershops";

-- DropTable
DROP TABLE "cancellations";

-- DropTable
DROP TABLE "favorites";

-- DropTable
DROP TABLE "reviews";

-- DropTable
DROP TABLE "services";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "senha" TEXT NOT NULL,
    "funcao" TEXT NOT NULL DEFAULT 'client',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barbearias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "avaliacao" DOUBLE PRECISION DEFAULT 0,
    "dono_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barbearias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "barbershop_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "duracao" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL,
    "barbershop_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "servico_id" TEXT NOT NULL,
    "data_agendamento" TIMESTAMP(3) NOT NULL,
    "hora_agendamento" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "notas" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "barbershop_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "avaliacao" INTEGER NOT NULL,
    "comentario" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "barbershop_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cancelamentos" (
    "id" TEXT NOT NULL,
    "agendamento_id" TEXT NOT NULL,
    "motivo" TEXT,
    "cancelado_por" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancelamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disponibilidades" (
    "id" TEXT NOT NULL,
    "barbershop_id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fim" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disponibilidades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefone_key" ON "usuarios"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "barbearias_dono_id_idx" ON "barbearias"("dono_id");

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_usuario_id_barbershop_id_key" ON "favoritos"("usuario_id", "barbershop_id");

-- CreateIndex
CREATE UNIQUE INDEX "cancelamentos_agendamento_id_key" ON "cancelamentos"("agendamento_id");

-- AddForeignKey
ALTER TABLE "barbearias" ADD CONSTRAINT "barbearias_dono_id_fkey" FOREIGN KEY ("dono_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancelamentos" ADD CONSTRAINT "cancelamentos_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
