-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'ORDER_CREATED', 'PAID', 'FAILED', 'EXPIRED');

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "frequency" TEXT NOT NULL DEFAULT 'one-time',
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "causeId" TEXT NOT NULL,
    "causeTitle" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "donorPhone" TEXT NOT NULL,
    "panNumber" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "country" TEXT DEFAULT 'India',
    "message" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "consentUpdates" BOOLEAN NOT NULL DEFAULT true,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "paymentMethod" TEXT,
    "capturedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "donations_referenceId_key" ON "donations"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_razorpayOrderId_key" ON "donations"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_razorpayPaymentId_key" ON "donations"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "donations_referenceId_idx" ON "donations"("referenceId");

-- CreateIndex
CREATE INDEX "donations_donorEmail_idx" ON "donations"("donorEmail");

-- CreateIndex
CREATE INDEX "donations_status_idx" ON "donations"("status");

-- CreateIndex
CREATE INDEX "donations_createdAt_idx" ON "donations"("createdAt");

-- CreateIndex
CREATE INDEX "donations_razorpayOrderId_idx" ON "donations"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "donations_razorpayPaymentId_idx" ON "donations"("razorpayPaymentId");
