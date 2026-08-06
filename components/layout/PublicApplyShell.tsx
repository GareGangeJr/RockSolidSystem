"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function PublicApplyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const nav = [
    { name: "Apply", href: "/apply/applicants" },
    { name: "Jobs", href: "/apply/job-orders" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Image src="/logo123.png" alt="Rock Solid Logo" width={48} height={48} className="h-12 w-12 shrink-0" priority />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-gray-900">Rock Solid Manpower</p>
            <p className="text-xs text-gray-500">Online Application</p>
          </div>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 px-4 pb-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 rounded-md px-3 py-2.5 text-center text-sm font-medium ${
                  active ? "bg-slate-900 text-white" : "bg-slate-100 text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-4 pb-10 sm:py-6">{children}</main>
    </div>
  )
}
