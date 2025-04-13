-- DropForeignKey
ALTER TABLE `SavedResult` DROP FOREIGN KEY `SavedResult_resultId_fkey`;

-- DropIndex
DROP INDEX `SavedResult_resultId_fkey` ON `SavedResult`;

-- AddForeignKey
ALTER TABLE `SavedResult` ADD CONSTRAINT `SavedResult_resultId_fkey` FOREIGN KEY (`resultId`) REFERENCES `Result`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
