/*
  Warnings:

  - You are about to alter the column `ownerId` on the `Document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Document` MODIFY `ownerId` INTEGER NOT NULL;
