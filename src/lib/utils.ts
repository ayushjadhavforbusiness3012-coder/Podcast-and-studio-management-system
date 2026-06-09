import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toYYYYMMDD(dateStr: string): string {
  if (!dateStr || dateStr === "—") return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Custom parsing for format like "25 May 2025" or "08 Jun 2026"
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
      const m = String(months[monthStr] + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      return `${year}-${m}-${dStr}`;
    }
  }
  return "";
}
export function fromYYYYMMDD(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 0 && month < 12) {
      return `${day} ${monthsAbbr[month]} ${year}`;
    }
  }
  return dateStr;
}
