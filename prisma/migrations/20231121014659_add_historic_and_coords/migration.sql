-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photo" TEXT;

-- CreateTable
CREATE TABLE "Historic" (
    "id" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Historic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coords" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "historicId" TEXT NOT NULL,

    CONSTRAINT "Coords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coords" ADD CONSTRAINT "Coords_historicId_fkey" FOREIGN KEY ("historicId") REFERENCES "Historic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
