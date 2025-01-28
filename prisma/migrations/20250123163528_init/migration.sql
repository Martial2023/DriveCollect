-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "mark" TEXT NOT NULL,
    "modelCar" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
