-- CreateTable
CREATE TABLE "sessoes" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "utilizadorId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessoes_token_key" ON "sessoes"("token");

-- CreateIndex
CREATE INDEX "sessoes_utilizadorId_idx" ON "sessoes"("utilizadorId");

-- CreateIndex
CREATE INDEX "sessoes_token_idx" ON "sessoes"("token");

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_utilizadorId_fkey" FOREIGN KEY ("utilizadorId") REFERENCES "utilizadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
