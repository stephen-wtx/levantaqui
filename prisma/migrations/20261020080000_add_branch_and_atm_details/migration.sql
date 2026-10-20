-- AlterTable
ALTER TABLE "atms" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "locationDetails" TEXT;

-- AlterTable
ALTER TABLE "filiais" ADD COLUMN     "referenceLocation" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "atms_code_key" ON "atms"("code");
