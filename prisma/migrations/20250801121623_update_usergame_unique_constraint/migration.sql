/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId,platform,level]` on the table `user_games` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."user_games_userId_gameId_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_games_userId_gameId_platform_level_key" ON "public"."user_games"("userId", "gameId", "platform", "level");
