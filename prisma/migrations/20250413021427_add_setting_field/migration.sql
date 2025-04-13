/*
  Warnings:

  - You are about to alter the column `type` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `image` on the `Test` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `setting` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Test` DROP FOREIGN KEY `Test_userId_fkey`;

-- DropIndex
DROP INDEX `Test_userId_fkey` ON `Test`;

-- DropIndex
DROP INDEX `User_providerId_key` ON `User`;

-- AlterTable
ALTER TABLE `Like` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Question` MODIFY `type` ENUM('subjective', 'objective') NOT NULL;

-- AlterTable
ALTER TABLE `Test` DROP COLUMN `image`,
    ADD COLUMN `setting` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `name`,
    DROP COLUMN `providerId`,
    ADD COLUMN `nickname` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Answer`;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `testId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Test` ADD CONSTRAINT `Test_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
