"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Users } from "lucide-react"

export default function PublicApplyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const nav = [
    { name: "Applicants", href: "/apply/applicants", icon: Users },
    { name: "Job Orders", href: "/apply/job-orders", icon: Briefcase },
  ]

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="flex min-h-screen w-64 flex-col border-r bg-blue-100">
        <img src="/logo123.png" alt="Rock Solid Logo" className="mx-auto w-32" />

        <div className="border-b border-gray-900 p-6 text-center">
          <h1 className="text-lg font-bold leading-5">
            Rock Solid Manpower <br />
            Network & Consultancy Inc.
          </h1>
        </div>

        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  active ? "bg-slate-900 text-white" : "text-black hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-gray-900 bg-white px-4">
          <div className="text-sm text-gray-600">For Applicants</div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
