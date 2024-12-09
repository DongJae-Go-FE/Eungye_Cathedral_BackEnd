-- AlterTable
ALTER TABLE "news" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "notices" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "weeklys" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);
