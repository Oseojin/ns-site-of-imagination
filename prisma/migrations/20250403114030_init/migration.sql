/*
  Warnings:

  - Added the required column `titleImage` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Test` ADD COLUMN `titleImage` VARCHAR(191) NOT NULL;
