import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function triggerTryClick() {
  if (typeof window === "undefined") return
  console.log("Trigger: Probar gratis clicked - scrolling to pricing")
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
}
