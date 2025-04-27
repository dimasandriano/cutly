import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateFaviconFromUrl(url?: string): string {
  if (!url) return "";
  return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
}

export function timeAgo(date?: Date): string {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
