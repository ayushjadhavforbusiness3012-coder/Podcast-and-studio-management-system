import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAddon,
  createBooking,
  createEpisode,
  createGuest,
  createInvoice,
  createNotification,
  createPackage,
  createUser,
  deleteAddonRecord,
  deleteBookingRecord,
  deleteEpisodeRecord,
  deleteGuestsRecord,
  deleteInvoiceRecord,
  deleteNotificationRecord,
  deletePackageRecord,
  deleteUserRecord,
  getAppData,
  markAllNotificationsReadRecord,
  markNotificationReadRecord,
  updateAddonRecord,
  updateAdminProfileRecord,
  updateBookingRecord,
  updateEpisodeRecord,
  updateGuestRecord,
  updateInvoiceRecord,
  updatePackageRecord,
  updateSettingsRecord,
  updateUserRecord,
} from "@/lib/api/app-data.functions";

export type Booking = {
  id: string;
  guest: string;
  studio: string;
  pkg: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  sv: "success" | "warning" | "destructive" | "primary" | "default";
  amt: string;
  paymentStatus: "Unpaid" | "Partially Paid" | "Paid" | "Refunded";
  paidAmount: string;
  duration?: number;
};

export type User = {
  id?: string;
  name: string;
  email: string;
  role: string;
  roleV: string;
  status: "Active" | "Inactive";
  joined: string;
  last: string;
  img: number;
  you?: boolean;
};

export type Guest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  topic: string;
  status: "Active" | "Inactive";
  date: string;
  bookings: number;
  img: number;
};

export type Episode = {
  id: string;
  ep: string;
  title: string;
  show: string;
  guest: string;
  img: number;
  dur: string;
  status: "Published" | "Scheduled" | "Draft" | "Archived";
  sv: "success" | "warning" | "info" | "default" | "destructive";
  date: string;
  publishedDate: string;
  time: string;
  color: string;
};

export type Invoice = {
  id: string;
  name: string;
  email: string;
  show: string;
  date: string;
  due: string;
  amount: string;
  paidAmount: string;
  status: "Paid" | "Pending" | "Partially Paid" | "Overdue" | "Refunded";
  img: number;
  bar: string;
};

export type Package = {
  id: string;
  iconName: "Star" | "Crown" | "Zap" | "Diamond" | "Building2" | "InfinityIcon";
  color: string;
  name: string;
  desc: string;
  cat: string;
  catV: string;
  dur: string;
  price: string;
  features: string[];
  extra: string;
  bookings: number;
  popular?: boolean;
};

export type Addon = {
  id: string;
  name: string;
  price: number;
  iconName: "Clock" | "Video" | "Headphones" | "Sparkles" | "Mic" | "Camera" | "Music";
};

export type Notification = {
  id: string;
  iconName: string;
  color: string;
  title: string;
  unread: boolean;
  category: "Bookings" | "Payments" | "Episodes" | "System";
  createdAt: string;
  time: string;
};

export type StudioSettings = {
  name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  logoUrl?: string;
};

export type LocalizationSettings = {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
};

export type BookingSettings = {
  defaultStatus: string;
  autoPublish: boolean;
  requireApproval: boolean;
  bufferTime: string;
  liveStreaming: boolean;
  videoRecording: boolean;
  guestUploads: boolean;
  publicProfile: boolean;
};

export type PaymentSettings = {
  currency: string;
  taxRate: number;
  stripeEnabled: boolean;
  paypalEnabled: boolean;
};

export type AppSettings = {
  studio: StudioSettings;
  localization: LocalizationSettings;
  booking: BookingSettings;
  payment: PaymentSettings;
  notifications: {
    emailAlerts: boolean;
    systemAlerts: boolean;
  };
};

export type AdminProfile = {
  name: string;
  email: string;
  avatarIndex: number;
  role: string;
  bio?: string;
};

type AppContextType = {
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "sv">) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  guests: Guest[];
  addGuest: (g: Omit<Guest, "id">) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  deleteGuests: (ids: string[]) => void;
  episodes: Episode[];
  addEpisode: (e: Omit<Episode, "id" | "sv" | "color" | "img" | "ep">) => void;
  updateEpisode: (id: string, updates: Partial<Episode>) => void;
  deleteEpisode: (id: string) => void;
  invoices: Invoice[];
  addInvoice: (i: Omit<Invoice, "id" | "bar" | "img">) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  packages: Package[];
  addPackage: (p: Omit<Package, "id">) => void;
  updatePackage: (id: string, updates: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  addons: Addon[];
  addAddon: (a: Omit<Addon, "id">) => void;
  updateAddon: (id: string, updates: Partial<Addon>) => void;
  deleteAddon: (id: string) => void;
  users: User[];
  addUser: (u: Omit<User, "you">) => void;
  updateUser: (index: number, updates: Partial<User>) => void;
  deleteUser: (index: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  adminProfile: AdminProfile;
  updateAdminProfile: (updates: Partial<AdminProfile>) => void;
  notifications: Notification[];
  addNotification: (title: string, category: Notification["category"], iconName: string, color: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  formatDate: (dateStr: string) => string;
  formatTime: (timeStr: string) => string;
};

const defaultSettings: AppSettings = {
  studio: {
    name: "Podcast Studio",
    tagline: "Record. Create. Publish.",
    description: "A professional podcasting studio for creators, businesses and brands to record high-quality content.",
    email: "hello@podcaststudio.com",
    phone: "+91 98765 43210",
    website: "https://podcaststudio.com",
    address: "123 Creator Street, Andheri West, Mumbai, Maharashtra 400053, India",
  },
  localization: {
    language: "English (US)",
    timezone: "(IST) Asia/Kolkata",
    dateFormat: "31 May 2025",
    timeFormat: "12 Hour (02:30 PM)",
  },
  booking: {
    defaultStatus: "Draft",
    autoPublish: true,
    requireApproval: false,
    bufferTime: "30 Minutes",
    liveStreaming: true,
    videoRecording: true,
    guestUploads: false,
    publicProfile: true,
  },
  payment: {
    currency: "₹ (INR)",
    taxRate: 18,
    stripeEnabled: true,
    paypalEnabled: false,
  },
  notifications: {
    emailAlerts: true,
    systemAlerts: true,
  },
};

const defaultAdminProfile: AdminProfile = {
  name: "Admin",
  email: "admin@podcaststudio.com",
  avatarIndex: 12,
  role: "Super Admin",
  bio: "Chief podcast officer and platform manager.",
};

const AppContext = createContext<AppContextType | undefined>(undefined);
const appDataQueryKey = ["app-data"] as const;

function parseDateString(dateStr: string): Date | null {
  if (!dateStr || dateStr === "—" || dateStr === "â€”") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }

  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1].toLowerCase().substring(0, 3);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(year) && monthStr in months) {
      return new Date(year, months[monthStr], day);
    }
  }

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  return null;
}

function formatDateHelper(dateStr: string, format: string): string {
  if (!dateStr || dateStr === "—" || dateStr === "â€”" || dateStr.toLowerCase().includes("ago") || dateStr.toLowerCase().includes("today") || dateStr.toLowerCase().includes("yesterday")) {
    return dateStr;
  }
  const dateObj = parseDateString(dateStr);
  if (!dateObj) return dateStr;

  const day = dateObj.getDate().toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  const monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthAbbr = monthsAbbr[dateObj.getMonth()];
  const monthNum = (dateObj.getMonth() + 1).toString().padStart(2, "0");

  if (format === "YYYY-MM-DD" || format === "2025-05-31") {
    return `${year}-${monthNum}-${day}`;
  } else if (format === "MM/DD/YYYY" || format === "05/31/2025") {
    return `${monthNum}/${day}/${year}`;
  } else if (format === "DD/MM/YYYY" || format === "31/05/2025") {
    return `${day}/${monthNum}/${year}`;
  } else {
    return `${parseInt(day, 10)} ${monthAbbr} ${year}`;
  }
}

function formatTimeHelper(timeStr: string, format: string): string {
  if (!timeStr) return timeStr;

  const formatSingleTime = (singleTime: string) => {
    const trimmed = singleTime.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return trimmed;

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3]?.toUpperCase();

    if (ampm) {
      if (format.includes("24 Hour")) {
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, "0")}:${minutes}`;
      } else {
        return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
      }
    } else {
      if (format.includes("12 Hour")) {
        const suffix = hours >= 12 ? "PM" : "AM";
        let displayHours = hours % 12;
        if (displayHours === 0) displayHours = 12;
        return `${displayHours.toString().padStart(2, "0")}:${minutes} ${suffix}`;
      } else {
        return `${hours.toString().padStart(2, "0")}:${minutes}`;
      }
    }
  };

  if (timeStr.includes("-")) {
    const parts = timeStr.split("-");
    if (parts.length === 2) {
      return `${formatSingleTime(parts[0])} - ${formatSingleTime(parts[1])}`;
    }
  }

  return formatSingleTime(timeStr);
}

function getRelativeTimeString(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return typeof dateInput === "string" ? dateInput : "Just now";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function normalizeSettings(dataSettings: unknown): AppSettings {
  const settings = dataSettings as Partial<AppSettings> | undefined;
  return {
    studio: { ...defaultSettings.studio, ...(settings?.studio ?? {}) },
    localization: { ...defaultSettings.localization, ...(settings?.localization ?? {}) },
    booking: { ...defaultSettings.booking, ...(settings?.booking ?? {}) },
    payment: { ...defaultSettings.payment, ...(settings?.payment ?? {}) },
    notifications: { ...defaultSettings.notifications, ...(settings?.notifications ?? {}) },
  };
}

function withoutPersistenceFields<T extends { createdAt?: unknown; updatedAt?: unknown; sortOrder?: unknown }>(item: T) {
  const { createdAt, updatedAt, sortOrder, ...rest } = item;
  void createdAt;
  void updatedAt;
  void sortOrder;
  return rest;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: appDataQueryKey,
    queryFn: () => getAppData(),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const invalidateAppData = () => {
    void queryClient.invalidateQueries({ queryKey: appDataQueryKey });
  };

  const runMutation = (mutation: () => Promise<unknown>) => {
    void mutation()
      .catch((error) => {
        console.error(error);
      })
      .finally(invalidateAppData);
  };

  const settings = normalizeSettings(data?.settings);
  const adminProfile = { ...defaultAdminProfile, ...(data?.adminProfile ?? {}) } as AdminProfile;
  const bookings = (data?.bookings ?? []).map(withoutPersistenceFields) as Booking[];
  const guests = (data?.guests ?? []).map(withoutPersistenceFields) as Guest[];
  const episodes = (data?.episodes ?? []).map(withoutPersistenceFields) as Episode[];
  const invoices = (data?.invoices ?? []).map(withoutPersistenceFields) as Invoice[];
  const packages = (data?.packages ?? []).map(withoutPersistenceFields) as Package[];
  const addons = (data?.addons ?? []).map(withoutPersistenceFields) as Addon[];
  const users = (data?.users ?? []).map(withoutPersistenceFields) as User[];
  const notifications = ((data?.notifications ?? []) as Omit<Notification, "time">[]).map((n) => ({
    ...n,
    time: getRelativeTimeString(n.createdAt),
  })) as Notification[];

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const formatDate = (dateStr: string) => formatDateHelper(dateStr, settings.localization.dateFormat);
  const formatTime = (timeStr: string) => formatTimeHelper(timeStr, settings.localization.timeFormat);

  const addBooking = (b: Omit<Booking, "id" | "sv">) => {
    runMutation(() => createBooking({ data: b }));
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    runMutation(() => updateBookingRecord({ data: { id, updates } }));
  };

  const deleteBooking = (id: string) => {
    runMutation(() => deleteBookingRecord({ data: { id } }));
  };

  const addGuest = (g: Omit<Guest, "id">) => {
    runMutation(() => createGuest({ data: g }));
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    runMutation(() => updateGuestRecord({ data: { id, updates } }));
  };

  const deleteGuest = (id: string) => {
    runMutation(() => deleteGuestsRecord({ data: { ids: [id] } }));
  };

  const deleteGuests = (ids: string[]) => {
    runMutation(() => deleteGuestsRecord({ data: { ids } }));
  };

  const addEpisode = (e: Omit<Episode, "id" | "sv" | "color" | "img" | "ep">) => {
    runMutation(() => createEpisode({ data: e }));
  };

  const updateEpisode = (id: string, updates: Partial<Episode>) => {
    runMutation(() => updateEpisodeRecord({ data: { id, updates } }));
  };

  const deleteEpisode = (id: string) => {
    runMutation(() => deleteEpisodeRecord({ data: { id } }));
  };

  const addInvoice = (i: Omit<Invoice, "id" | "bar" | "img">) => {
    runMutation(() => createInvoice({ data: i }));
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    runMutation(() => updateInvoiceRecord({ data: { id, updates } }));
  };

  const deleteInvoice = (id: string) => {
    runMutation(() => deleteInvoiceRecord({ data: { id } }));
  };

  const addPackage = (p: Omit<Package, "id">) => {
    runMutation(() => createPackage({ data: p }));
  };

  const updatePackage = (id: string, updates: Partial<Package>) => {
    runMutation(() => updatePackageRecord({ data: { id, updates } }));
  };

  const deletePackage = (id: string) => {
    runMutation(() => deletePackageRecord({ data: { id } }));
  };

  const addAddon = (a: Omit<Addon, "id">) => {
    runMutation(() => createAddon({ data: a }));
  };

  const updateAddon = (id: string, updates: Partial<Addon>) => {
    runMutation(() => updateAddonRecord({ data: { id, updates } }));
  };

  const deleteAddon = (id: string) => {
    runMutation(() => deleteAddonRecord({ data: { id } }));
  };

  const addUser = (u: Omit<User, "you">) => {
    runMutation(() => createUser({ data: u }));
  };

  const updateUser = (index: number, updates: Partial<User>) => {
    const id = users[index]?.id;
    if (!id) return;
    runMutation(() => updateUserRecord({ data: { id, updates } }));
  };

  const deleteUser = (index: number) => {
    const id = users[index]?.id;
    if (!id) return;
    runMutation(() => deleteUserRecord({ data: { id } }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    runMutation(() => updateSettingsRecord({ data: updates }));
  };

  const updateAdminProfile = (updates: Partial<AdminProfile>) => {
    runMutation(() => updateAdminProfileRecord({ data: updates }));
  };

  const addNotification = (title: string, category: Notification["category"], iconName: string, color: string) => {
    if (!settings.notifications.systemAlerts) return;
    runMutation(() => createNotification({ data: { title, category, iconName, color } }));
  };

  const markNotificationRead = (id: string) => {
    runMutation(() => markNotificationReadRecord({ data: { id } }));
  };

  const markAllNotificationsRead = () => {
    runMutation(() => markAllNotificationsReadRecord());
  };

  const deleteNotification = (id: string) => {
    runMutation(() => deleteNotificationRecord({ data: { id } }));
  };

  return (
    <AppContext.Provider
      value={{
        bookings, addBooking, updateBooking, deleteBooking,
        guests, addGuest, updateGuest, deleteGuest, deleteGuests,
        episodes, addEpisode, updateEpisode, deleteEpisode,
        invoices, addInvoice, updateInvoice, deleteInvoice,
        packages, addPackage, updatePackage, deletePackage,
        addons, addAddon, updateAddon, deleteAddon,
        users, addUser, updateUser, deleteUser,
        searchQuery, setSearchQuery,
        isLoggedIn, login, logout,
        settings, updateSettings,
        adminProfile, updateAdminProfile,
        notifications, addNotification, markNotificationRead, markAllNotificationsRead, deleteNotification,
        formatDate, formatTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
