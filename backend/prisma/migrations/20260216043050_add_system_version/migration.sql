-- CreateTable
CREATE TABLE "versoes_sistema" (
    "id" TEXT NOT NULL,
    "major" INTEGER NOT NULL DEFAULT 0,
    "minor" INTEGER NOT NULL DEFAULT 1,
    "patch" INTEGER NOT NULL DEFAULT 0,
    "migracao_numero" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "versoes_sistema_pkey" PRIMARY KEY ("id")
);
