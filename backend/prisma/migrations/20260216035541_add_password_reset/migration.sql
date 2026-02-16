-- CreateTable
CREATE TABLE "recuperacoes_senha" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recuperacoes_senha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recuperacoes_senha_token_key" ON "recuperacoes_senha"("token");

-- AddForeignKey
ALTER TABLE "recuperacoes_senha" ADD CONSTRAINT "recuperacoes_senha_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
