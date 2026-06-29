import { requireAdmin } from "@/lib/require-role"

export default async function EmployeesLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return children
}
