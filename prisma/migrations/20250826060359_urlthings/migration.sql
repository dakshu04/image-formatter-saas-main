/*
  Warnings:

  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "url",
ADD COLUMN     "originalUrl" TEXT;
