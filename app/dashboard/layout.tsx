import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = {
  title: "Dashboard - Resply",
  description: "Panel de control para gestionar tus reseñas de Google Business",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <DashboardShell>{children}</DashboardShell>
    </ThemeProvider>
  )
}
