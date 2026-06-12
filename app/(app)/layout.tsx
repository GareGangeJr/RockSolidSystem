import AppShell from "@/components/layout/app-shell"
import { createSupabaseServer } from "@/lib/supabase/server"
import { getAccessRole } from "@/lib/user-role"
import { redirect } from "next/navigation"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const role = await getAccessRole(supabase, user.id)
  if (!role) redirect("/login")

  return <AppShell role={role}>{children}</AppShell>
}
