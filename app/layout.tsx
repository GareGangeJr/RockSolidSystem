import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Rock Solid Manpower System",
  description: "Manpower recruitment and deployment management for Rock Solid Manpower Network & Consultancy Inc.",
  icons: {
    icon: "/logo123.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
