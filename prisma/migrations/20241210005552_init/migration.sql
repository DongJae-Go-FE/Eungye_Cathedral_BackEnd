/*
  Warnings:

  - The primary key for the `news` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `news` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notices` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `weeklys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `weeklys` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "news" DROP CONSTRAINT "news_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TEXT,
ALTER COLUMN "imgUrl" SET DATA TYPE TEXT,
ADD CONSTRAINT "news_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notices" DROP CONSTRAINT "notices_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TEXT,
ALTER COLUMN "img_url" SET DATA TYPE TEXT,
ADD CONSTRAINT "notices_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "weeklys" DROP CONSTRAINT "weeklys_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TEXT,
ALTER COLUMN "imgUrl" SET DATA TYPE TEXT,
ADD CONSTRAINT "weeklys_pkey" PRIMARY KEY ("id");
