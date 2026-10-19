/*
  Warnings:

  - You are about to drop the column `category` on the `team_members` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "team_members_category_idx";

-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "category";
