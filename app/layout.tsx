import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "FEASTO Admin - Food Delivery Management",
  description: "Advanced admin dashboard for food delivery platform management",
  keywords: "food delivery, admin dashboard, restaurant management, order tracking",
  icons: {
    icon: "/images/feasto-logo.png", 
           },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-inter bg-slate-900 text-white`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}