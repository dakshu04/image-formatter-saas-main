/*
  Warnings:

  - You are about to drop the column `format` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "format",
DROP COLUMN "height",
DROP COLUMN "size",
DROP COLUMN "width",
ALTER COLUMN "url" DROP NOT NULL;
