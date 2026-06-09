const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function clearBusinessData() {
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.guest.deleteMany(),
    prisma.episode.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.studioPackage.deleteMany(),
    prisma.addon.deleteMany(),
    prisma.appUser.deleteMany(),
  ]);
}

async function seedDefaults() {
  await prisma.studioSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Podcast Studio",
      tagline: "Record. Create. Publish.",
      description: "A professional podcasting studio for creators, businesses and brands to record high-quality content.",
      email: "hello@podcaststudio.com",
      phone: "+91 98765 43210",
      website: "https://podcaststudio.com",
      address: "123 Creator Street, Andheri West, Mumbai, Maharashtra 400053, India",
    },
  });

  await prisma.localizationSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      language: "English (US)",
      timezone: "(IST) Asia/Kolkata",
      dateFormat: "31 May 2025",
      timeFormat: "12 Hour (02:30 PM)",
    },
  });

  await prisma.bookingSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      defaultStatus: "Draft",
      autoPublish: true,
      requireApproval: false,
      bufferTime: "30 Minutes",
      liveStreaming: true,
      videoRecording: true,
      guestUploads: false,
      publicProfile: true,
    },
  });

  await prisma.paymentSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      currency: "INR",
      taxRate: 18,
      stripeEnabled: true,
      paypalEnabled: false,
    },
  });

  await prisma.notificationSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      emailAlerts: true,
      systemAlerts: true,
    },
  });

  await prisma.adminProfile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Admin",
      email: "admin@podcaststudio.com",
      avatarIndex: 12,
      role: "Super Admin",
      bio: "Chief podcast officer and platform manager.",
    },
  });
}

async function main() {
  await clearBusinessData();
  await seedDefaults();
  console.log("Seeded required app defaults and cleared demo business data.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
