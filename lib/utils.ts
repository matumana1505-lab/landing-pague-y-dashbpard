import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function triggerTryClick() {
  if (typeof window === "undefined") return
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
}
