"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  CalendarCheck,
  BarChart3,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const nav = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Applicants", href: "/applicants", icon: Users },
    { name: "Job Orders", href: "/job-orders", icon: Briefcase },
    { name: "201 Files", href: "/201-files", icon: FolderKanban },
    { name: "Attendance", href: "/attendance", icon: CalendarCheck },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ]

  return (
    <aside className="w-64 border-r bg-blue-100 min-h-screen">
      <div className="p-4 border-b">
        <div className="font-bold text-lg">Rock Solid</div>
        <div className="text-xs text-grey-500">Recruitment System</div>
      </div>

      <nav className="p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm
              ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
