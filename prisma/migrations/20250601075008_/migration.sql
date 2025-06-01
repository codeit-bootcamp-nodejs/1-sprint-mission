/*
  Warnings:

  - You are about to drop the column `articleId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `payload` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PRICE_CHANGED', 'NEW_COMMENT');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_productId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "articleId",
DROP COLUMN "content",
DROP COLUMN "isRead",
DROP COLUMN "productId",
ADD COLUMN     "payload" JSONB NOT NULL,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;
