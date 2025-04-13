-- CreateTable
CREATE TABLE `SavedResult` (
    `id` VARCHAR(191) NOT NULL,
    `resultId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SavedResult` ADD CONSTRAINT `SavedResult_resultId_fkey` FOREIGN KEY (`resultId`) REFERENCES `Result`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
