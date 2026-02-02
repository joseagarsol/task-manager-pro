import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wrapperDate(date: Date) {
  return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
}
