import { requireAdmin } from "@/lib/require-role"

export default async function ActivityLogsLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return children
}
