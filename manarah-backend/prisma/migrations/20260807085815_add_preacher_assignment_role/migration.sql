-- CreateEnum
CREATE TYPE "AssignmentRole" AS ENUM ('IMAM', 'KHATIB');

-- AlterTable
ALTER TABLE "PreacherAssignment" ADD COLUMN     "role" "AssignmentRole" NOT NULL DEFAULT 'KHATIB';
