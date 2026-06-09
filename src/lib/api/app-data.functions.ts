import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingStatusSchema = z.enum(["Confirmed", "Pending", "Cancelled", "Completed"]);
const paymentStatusSchema = z.enum(["Unpaid", "Partially Paid", "Paid", "Refunded"]);
const guestStatusSchema = z.enum(["Active", "Inactive"]);
const episodeStatusSchema = z.enum(["Published", "Scheduled", "Draft", "Archived"]);
const invoiceStatusSchema = z.enum(["Paid", "Pending", "Partially Paid", "Overdue", "Refunded"]);
const notificationCategorySchema = z.enum(["Bookings", "Payments", "Episodes", "System"]);

const bookingInputSchema = z.object({
  guest: z.string(),
  studio: z.string(),
  pkg: z.string(),
  date: z.string(),
  time: z.string(),
  status: bookingStatusSchema,
  amt: z.string(),
  paymentStatus: paymentStatusSchema,
  paidAmount: z.string(),
  duration: z.number().optional(),
});

const guestInputSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  topic: z.string(),
  status: guestStatusSchema,
  date: z.string(),
  bookings: z.number(),
  img: z.number(),
});

const episodeInputSchema = z.object({
  title: z.string(),
  show: z.string(),
  guest: z.string(),
  dur: z.string(),
  status: episodeStatusSchema,
  date: z.string(),
  publishedDate: z.string(),
  time: z.string(),
});

const invoiceInputSchema = z.object({
  name: z.string(),
  email: z.string(),
  show: z.string(),
  date: z.string(),
  due: z.string(),
  amount: z.string(),
  paidAmount: z.string(),
  status: invoiceStatusSchema,
});

const packageInputSchema = z.object({
  iconName: z.string(),
  color: z.string(),
  name: z.string(),
  desc: z.string(),
  cat: z.string(),
  catV: z.string(),
  dur: z.string(),
  price: z.string(),
  features: z.array(z.string()),
  extra: z.string(),
  bookings: z.number(),
  popular: z.boolean().optional(),
});

const addonInputSchema = z.object({
  name: z.string(),
  price: z.number(),
  iconName: z.string(),
});

const userInputSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string(),
  roleV: z.string(),
  status: z.enum(["Active", "Inactive"]),
  joined: z.string(),
  last: z.string(),
  img: z.number(),
  you: z.boolean().optional(),
});

const settingsInputSchema = z.object({
  studio: z.object({
    name: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
    logoUrl: z.string().optional(),
  }).optional(),
  localization: z.object({
    language: z.string().optional(),
    timezone: z.string().optional(),
    dateFormat: z.string().optional(),
    timeFormat: z.string().optional(),
  }).optional(),
  booking: z.object({
    defaultStatus: z.string().optional(),
    autoPublish: z.boolean().optional(),
    requireApproval: z.boolean().optional(),
    bufferTime: z.string().optional(),
    liveStreaming: z.boolean().optional(),
    videoRecording: z.boolean().optional(),
    guestUploads: z.boolean().optional(),
    publicProfile: z.boolean().optional(),
  }).optional(),
  payment: z.object({
    currency: z.string().optional(),
    taxRate: z.number().optional(),
    stripeEnabled: z.boolean().optional(),
    paypalEnabled: z.boolean().optional(),
  }).optional(),
  notifications: z.object({
    emailAlerts: z.boolean().optional(),
    systemAlerts: z.boolean().optional(),
  }).optional(),
});

const adminProfileInputSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  avatarIndex: z.number().optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
});

async function getPrisma() {
  const { prisma } = await import("../db.server");
  return prisma;
}

function bookingSv(status: string) {
  if (status === "Confirmed") return "success";
  if (status === "Pending") return "warning";
  if (status === "Cancelled") return "destructive";
  if (status === "Completed") return "primary";
  return "default";
}

function episodeSv(status: string) {
  if (status === "Published") return "success";
  if (status === "Scheduled") return "warning";
  if (status === "Draft") return "info";
  return "default";
}

function invoiceBar(status: string) {
  if (status === "Paid") return "bg-success";
  if (status === "Partially Paid") return "bg-info";
  if (status === "Pending") return "bg-warning";
  if (status === "Overdue") return "bg-destructive";
  if (status === "Refunded") return "bg-muted";
  return "bg-primary";
}

async function nextPrefixedId(model: { findMany: (args: any) => Promise<Array<{ id: string }>> }, prefix: string, fallback: number) {
  const rows = await model.findMany({ select: { id: true } });
  const next = rows.reduce((max, row) => {
    const value = Number(row.id.replace(prefix, ""));
    return Number.isFinite(value) ? Math.max(max, value + 1) : max;
  }, fallback);
  return `${prefix}${next}`;
}

async function addNotificationRecord(
  tx: { notification: { create: (args: any) => Promise<unknown> } },
  title: string,
  category: string,
  iconName: string,
  color: string,
) {
  await tx.notification.create({
    data: {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      iconName,
      color,
      title,
      unread: true,
      category,
      createdAt: new Date(),
    },
  });
}

function serializeNotification(notification: { createdAt: Date }) {
  return {
    ...notification,
    createdAt: notification.createdAt.toISOString(),
  };
}

export const getAppData = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const [
    bookings,
    guests,
    episodes,
    invoices,
    packages,
    addons,
    users,
    notifications,
    studio,
    localization,
    booking,
    payment,
    notificationSettings,
    adminProfile,
  ] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.guest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.episode.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.invoice.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.studioPackage.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.addon.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.appUser.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.notification.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.studioSettings.findUnique({ where: { id: "default" } }),
    prisma.localizationSettings.findUnique({ where: { id: "default" } }),
    prisma.bookingSettings.findUnique({ where: { id: "default" } }),
    prisma.paymentSettings.findUnique({ where: { id: "default" } }),
    prisma.notificationSettings.findUnique({ where: { id: "default" } }),
    prisma.adminProfile.findUnique({ where: { id: "default" } }),
  ]);

  return {
    bookings,
    guests,
    episodes,
    invoices,
    packages,
    addons,
    users,
    notifications: notifications.map(serializeNotification),
    settings: {
      studio,
      localization,
      booking,
      payment,
      notifications: notificationSettings,
    },
    adminProfile,
  };
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator(bookingInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    const id = await nextPrefixedId(prisma.booking, "BK-", 1025);
    const record = { ...data, id, sv: bookingSv(data.status) };
    await prisma.$transaction(async (tx) => {
      await tx.booking.create({ data: record });
      await tx.guest.updateMany({ where: { name: data.guest }, data: { bookings: { increment: 1 } } });
      await addNotificationRecord(tx, `New studio booking ${id} created for ${data.guest}`, "Bookings", "Calendar", "bg-accent text-primary");
      if (data.paymentStatus === "Paid" || data.paymentStatus === "Partially Paid") {
        await addNotificationRecord(tx, `Payment of ${data.paidAmount} recorded for booking ${id}`, "Payments", "CreditCard", "bg-success/15 text-success");
      }
    });
    return record;
  });

export const updateBookingRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), updates: bookingInputSchema.partial().extend({ id: z.string().optional(), sv: z.string().optional() }) }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    const existing = await prisma.booking.findUniqueOrThrow({ where: { id: data.id } });
    const updates = {
      ...data.updates,
      sv: data.updates.status ? bookingSv(data.updates.status) : undefined,
    };
    await prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({ where: { id: data.id }, data: updates });
      if (data.updates.guest && data.updates.guest !== existing.guest) {
        const previousGuest = await tx.guest.findFirst({ where: { name: existing.guest } });
        if (previousGuest) {
          await tx.guest.update({ where: { id: previousGuest.id }, data: { bookings: Math.max(0, previousGuest.bookings - 1) } });
        }
        await tx.guest.updateMany({ where: { name: data.updates.guest }, data: { bookings: { increment: 1 } } });
      }
      if (data.updates.status && data.updates.status !== existing.status) {
        await addNotificationRecord(
          tx,
          data.updates.status === "Cancelled" ? `Booking ${data.id} was cancelled` : `Booking ${data.id} status updated to ${data.updates.status}`,
          "Bookings",
          "Calendar",
          data.updates.status === "Cancelled" ? "bg-destructive/10 text-destructive" : "bg-accent text-primary",
        );
      } else {
        await addNotificationRecord(tx, `Booking ${data.id} details updated`, "Bookings", "Calendar", "bg-accent text-primary");
      }
      if (data.updates.paymentStatus && data.updates.paymentStatus !== existing.paymentStatus) {
        await addNotificationRecord(tx, `Booking ${data.id} payment status updated to ${data.updates.paymentStatus}`, "Payments", "CreditCard", "bg-success/15 text-success");
      }
      return updated;
    });
  });

export const deleteBookingRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findUniqueOrThrow({ where: { id: data.id } });
      await tx.booking.delete({ where: { id: data.id } });
      const guest = await tx.guest.findFirst({ where: { name: existing.guest } });
      if (guest) {
        await tx.guest.update({ where: { id: guest.id }, data: { bookings: Math.max(0, guest.bookings - 1) } });
      }
      await addNotificationRecord(tx, `Booking ${data.id} was deleted`, "Bookings", "Calendar", "bg-destructive/10 text-destructive");
    });
  });

export const createGuest = createServerFn({ method: "POST" })
  .inputValidator(guestInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.guest.create({ data: { ...data, id: `G-${Date.now()}` } });
  });

export const updateGuestRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), updates: guestInputSchema.partial() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.guest.update({ where: { id: data.id }, data: data.updates });
  });

export const deleteGuestsRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.guest.deleteMany({ where: { id: { in: data.ids } } });
  });

export const createEpisode = createServerFn({ method: "POST" })
  .inputValidator(episodeInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    const count = await prisma.episode.count();
    const ep = count.toString().padStart(2, "0");
    const id = `EP-1${ep}`;
    const colors = ["bg-primary", "bg-info", "bg-warning", "bg-pink", "bg-accent-foreground", "bg-destructive"];
    const record = { ...data, id, ep, img: Math.floor(Math.random() * 70), sv: episodeSv(data.status), color: colors[Math.floor(Math.random() * colors.length)] };
    await prisma.$transaction(async (tx) => {
      await tx.episode.create({ data: record });
      await addNotificationRecord(
        tx,
        data.status === "Published" ? `Episode '${data.title}' published successfully` : `New episode draft '${data.title}' created`,
        "Episodes",
        "Mic2",
        data.status === "Published" ? "bg-warning/20 text-warning-foreground" : "bg-muted text-muted-foreground",
      );
    });
    return record;
  });

export const updateEpisodeRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), updates: episodeInputSchema.partial().extend({ ep: z.string().optional(), sv: z.string().optional(), color: z.string().optional(), img: z.number().optional() }) }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    const existing = await prisma.episode.findUniqueOrThrow({ where: { id: data.id } });
    const updates = { ...data.updates, sv: data.updates.status ? episodeSv(data.updates.status) : undefined };
    await prisma.$transaction(async (tx) => {
      const updated = await tx.episode.update({ where: { id: data.id }, data: updates });
      if (data.updates.status && data.updates.status !== existing.status && data.updates.status === "Published") {
        await addNotificationRecord(tx, `Episode '${updated.title}' published successfully`, "Episodes", "Mic2", "bg-warning/20 text-warning-foreground");
      }
      return updated;
    });
  });

export const deleteEpisodeRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.episode.delete({ where: { id: data.id } });
  });

export const createInvoice = createServerFn({ method: "POST" })
  .inputValidator(invoiceInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    const id = await nextPrefixedId(prisma.invoice, "INV-", 1009);
    const record = { ...data, id, img: Math.floor(Math.random() * 70), bar: invoiceBar(data.status) };
    await prisma.$transaction(async (tx) => {
      await tx.invoice.create({ data: record });
      if (data.status === "Paid") {
        await addNotificationRecord(tx, `Payment of ${data.amount} received from ${data.name}`, "Payments", "CreditCard", "bg-success/15 text-success");
      } else if (data.status === "Overdue") {
        await addNotificationRecord(tx, `Invoice ${id} (${data.amount}) is overdue for ${data.name}`, "Payments", "CreditCard", "bg-destructive/10 text-destructive");
      }
    });
    return record;
  });

export const updateInvoiceRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), updates: invoiceInputSchema.partial().extend({ img: z.number().optional(), bar: z.string().optional() }) }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    const existing = await prisma.invoice.findUniqueOrThrow({ where: { id: data.id } });
    const updates = { ...data.updates, bar: data.updates.status ? invoiceBar(data.updates.status) : undefined };
    await prisma.$transaction(async (tx) => {
      const updated = await tx.invoice.update({ where: { id: data.id }, data: updates });
      if (data.updates.status && data.updates.status !== existing.status) {
        if (data.updates.status === "Paid") {
          await addNotificationRecord(tx, `Payment of ${updated.amount} received from ${updated.name}`, "Payments", "CreditCard", "bg-success/15 text-success");
        } else if (data.updates.status === "Overdue") {
          await addNotificationRecord(tx, `Payment of ${updated.amount} failed/overdue for ${updated.name}`, "Payments", "CreditCard", "bg-destructive/10 text-destructive");
        }
      }
      return updated;
    });
  });

export const deleteInvoiceRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.invoice.delete({ where: { id: data.id } });
  });

export const createPackage = createServerFn({ method: "POST" })
  .inputValidator(packageInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    const record = { ...data, id: `PKG-${Date.now()}`, popular: Boolean(data.popular) };
    await prisma.$transaction(async (tx) => {
      await tx.studioPackage.create({ data: record });
      await addNotificationRecord(tx, `New package '${data.name}' created`, "System", "Package", "bg-pink/20 text-pink-foreground");
    });
    return record;
  });

export const updatePackageRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), updates: packageInputSchema.partial() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    await prisma.$transaction(async (tx) => {
      const existing = await tx.studioPackage.findUniqueOrThrow({ where: { id: data.id } });
      await tx.studioPackage.update({ where: { id: data.id }, data: data.updates });
      await addNotificationRecord(tx, `Package '${existing.name}' updated`, "System", "Package", "bg-pink/20 text-pink-foreground");
    });
  });

export const deletePackageRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.studioPackage.delete({ where: { id: data.id } });
  });

export const createAddon = createServerFn({ method: "POST" })
  .inputValidator(addonInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.addon.create({ data: { ...data, id: `ADD-${Date.now()}` } });
  });

export const updateAddonRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), updates: addonInputSchema.partial() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.addon.update({ where: { id: data.id }, data: data.updates });
  });

export const deleteAddonRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.addon.delete({ where: { id: data.id } });
  });

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(userInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    const sortOrder = await prisma.appUser.count();
    await prisma.$transaction(async (tx) => {
      await tx.appUser.create({ data: { ...data, img: Math.floor(Math.random() * 70), you: Boolean(data.you), sortOrder } });
      await addNotificationRecord(tx, `New user '${data.name}' registered as ${data.role}`, "System", "UserPlus", "bg-info/15 text-info");
    });
  });

export const updateUserRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), updates: userInputSchema.partial() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.appUser.update({ where: { id: data.id }, data: data.updates });
  });

export const deleteUserRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.appUser.delete({ where: { id: data.id } });
  });

export const updateSettingsRecord = createServerFn({ method: "POST" })
  .inputValidator(settingsInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    await Promise.all([
      data.studio ? prisma.studioSettings.upsert({ where: { id: "default" }, update: data.studio, create: { id: "default", name: "", tagline: "", description: "", email: "", phone: "", website: "", address: "", ...data.studio } }) : null,
      data.localization ? prisma.localizationSettings.upsert({ where: { id: "default" }, update: data.localization, create: { id: "default", language: "", timezone: "", dateFormat: "", timeFormat: "", ...data.localization } }) : null,
      data.booking ? prisma.bookingSettings.upsert({ where: { id: "default" }, update: data.booking, create: { id: "default", defaultStatus: "", autoPublish: false, requireApproval: false, bufferTime: "", liveStreaming: false, videoRecording: false, guestUploads: false, publicProfile: false, ...data.booking } }) : null,
      data.payment ? prisma.paymentSettings.upsert({ where: { id: "default" }, update: data.payment, create: { id: "default", currency: "", taxRate: 0, stripeEnabled: false, paypalEnabled: false, ...data.payment } }) : null,
      data.notifications ? prisma.notificationSettings.upsert({ where: { id: "default" }, update: data.notifications, create: { id: "default", emailAlerts: false, systemAlerts: false, ...data.notifications } }) : null,
    ]);
  });

export const updateAdminProfileRecord = createServerFn({ method: "POST" })
  .inputValidator(adminProfileInputSchema)
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.adminProfile.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", name: "Admin", email: "admin@podcaststudio.com", avatarIndex: 12, role: "Super Admin", ...data },
    });
  });

export const createNotification = createServerFn({ method: "POST" })
  .inputValidator(z.object({ title: z.string(), category: notificationCategorySchema, iconName: z.string(), color: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.notification.create({
      data: {
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...data,
        unread: true,
        createdAt: new Date(),
      },
    });
  });

export const markNotificationReadRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.notification.update({ where: { id: data.id }, data: { unread: false } });
  });

export const markAllNotificationsReadRecord = createServerFn({ method: "POST" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.notification.updateMany({ data: { unread: false } });
});

export const deleteNotificationRecord = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const prisma = await getPrisma();
    return prisma.notification.delete({ where: { id: data.id } });
  });
