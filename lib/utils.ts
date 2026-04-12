import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function calculateDiscountedPrice(price: number, discount: number): number {
  return price - (price * discount) / 100;
}

export const categories = [
  "Discord",
  "WhatsApp",
  "Telegram",
  "Automação",
] as const;

export type Category = (typeof categories)[number];
