-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "guest" TEXT NOT NULL,
    "studio" TEXT NOT NULL,
    "pkg" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sv" TEXT NOT NULL,
    "amt" TEXT NOT NULL,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "bookings" INTEGER NOT NULL DEFAULT 0,
    "img" INTEGER NOT NULL DEFAULT 12,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "ep" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "show" TEXT NOT NULL,
    "guest" TEXT NOT NULL,
    "img" INTEGER NOT NULL,
    "dur" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sv" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "show" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "due" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "img" INTEGER NOT NULL,
    "bar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioPackage" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "cat" TEXT NOT NULL,
    "catV" TEXT NOT NULL,
    "dur" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "extra" TEXT NOT NULL,
    "bookings" INTEGER NOT NULL DEFAULT 0,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudioPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "iconName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "roleV" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "joined" TEXT NOT NULL,
    "last" TEXT NOT NULL,
    "img" INTEGER NOT NULL,
    "you" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "logoUrl" TEXT,

    CONSTRAINT "StudioSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalizationSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "language" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "dateFormat" TEXT NOT NULL,
    "timeFormat" TEXT NOT NULL,

    CONSTRAINT "LocalizationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "defaultStatus" TEXT NOT NULL,
    "autoPublish" BOOLEAN NOT NULL,
    "requireApproval" BOOLEAN NOT NULL,
    "bufferTime" TEXT NOT NULL,
    "liveStreaming" BOOLEAN NOT NULL,
    "videoRecording" BOOLEAN NOT NULL,
    "guestUploads" BOOLEAN NOT NULL,
    "publicProfile" BOOLEAN NOT NULL,

    CONSTRAINT "BookingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "currency" TEXT NOT NULL,
    "taxRate" INTEGER NOT NULL,
    "stripeEnabled" BOOLEAN NOT NULL,
    "paypalEnabled" BOOLEAN NOT NULL,

    CONSTRAINT "PaymentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "emailAlerts" BOOLEAN NOT NULL,
    "systemAlerts" BOOLEAN NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarIndex" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");
