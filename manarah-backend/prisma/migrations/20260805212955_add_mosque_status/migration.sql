-- CreateEnum
CREATE TYPE "MosqueStatus" AS ENUM ('ACTIVE', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "Mosque" ADD COLUMN     "status" "MosqueStatus" NOT NULL DEFAULT 'ACTIVE';
