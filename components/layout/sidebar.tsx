"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  CalendarCheck,
  BarChart3,
  Building2,
  Archive,
  ScrollText,
  type LucideIcon,
} from "lucide-react"
import type { AccessRole } from "@/lib/user-role"

type NavItem = {
  name: string
  href: string
  icon: LucideIcon
  roles: AccessRole[]
}

const NAV: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin", "staff"] },
  { name: "Applicants", href: "/applicants", icon: Users, roles: ["admin", "staff"] },
  { name: "Job Orders", href: "/job-orders", icon: Briefcase, roles: ["admin", "staff"] },
  { name: "Monitoring", href: "/monitoring", icon: Building2, roles: ["admin", "staff"] },
  { name: "Employees", href: "/employees", icon: FolderKanban, roles: ["admin"] },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck, roles: ["admin", "staff"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin"] },
  { name: "Activity Logs", href: "/activity-logs", icon: ScrollText, roles: ["admin"] },
  { name: "Archive", href: "/archive", icon: Archive, roles: ["admin", "staff"] },
]

export default function Sidebar({ role }: { role: AccessRole }) {
  const pathname = usePathname()
  const nav = NAV.filter((item) => item.roles.includes(role))

  return (
    <aside className="w-64 border-r bg-blue-100 min-h-screen flex flex-col">
      <Image src="/logo123.png" alt="Rock Solid Logo" width={128} height={128} className="mx-auto w-32" priority />

      <div className="p-6 border-b border-gray-900 text-center">
        <h1 className="font-bold text-lg leading-5">
          Rock Solid Manpower <br />
          Network & Consultancy Inc.
        </h1>
      </div>

      <nav className="p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
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
  )
}
