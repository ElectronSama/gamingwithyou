/*
  Warnings:

  - A unique constraint covering the columns `[igdbId]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[igdbSlug]` on the table `games` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."games" ADD COLUMN     "igdbCoverUrl" TEXT,
ADD COLUMN     "igdbId" INTEGER,
ADD COLUMN     "igdbRating" DOUBLE PRECISION,
ADD COLUMN     "igdbRatingCount" INTEGER,
ADD COLUMN     "igdbScreenshots" TEXT[],
ADD COLUMN     "igdbSlug" TEXT,
ADD COLUMN     "igdbVideos" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "games_igdbId_key" ON "public"."games"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "games_igdbSlug_key" ON "public"."games"("igdbSlug");
