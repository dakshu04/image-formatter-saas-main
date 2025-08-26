/*
  Warnings:

  - You are about to drop the column `removeBgUrl` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "removeBgUrl",
ADD COLUMN     "bgRemovedUrl" TEXT;
