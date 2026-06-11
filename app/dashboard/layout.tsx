import type { Metadata } from "next"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ThemeProvider } from "@/components/theme-provider"

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
      <div className="bg-background">
        {children}
      </div>
    </ThemeProvider>
  )
}
