/*
  Warnings:

  - The values [DOCTOR] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `specialization` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'PATIENT') NOT NULL DEFAULT 'PATIENT';
