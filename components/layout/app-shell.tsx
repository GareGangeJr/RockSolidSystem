import Sidebar from "./sidebar"
import Topbar from "./topbar"
import type { AccessRole } from "@/lib/user-role"

export default function AppShell({
  children,
  role,
}: {
  children: React.ReactNode
  role: AccessRole
}) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
