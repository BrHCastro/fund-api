/*
  Warnings:

  - You are about to drop the column `delete_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `delete_at`,
    DROP COLUMN `update_at`,
    ADD COLUMN `deleted_at` TIMESTAMP(6) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);
