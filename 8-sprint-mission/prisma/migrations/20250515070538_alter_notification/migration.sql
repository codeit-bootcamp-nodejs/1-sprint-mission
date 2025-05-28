/*
  Warnings:

  - You are about to drop the column `articleId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_productId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "articleId",
DROP COLUMN "productId";
