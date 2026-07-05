import { createSupabaseServer } from "@/lib/supabase/server"
import { getAccessRole, type AccessRole } from "@/lib/user-role"
import { redirect } from "next/navigation"

export async function requireAuthRole(): Promise<AccessRole> {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const role = await getAccessRole(supabase, user.id)
  if (!role) redirect("/login")

  return role
}

export async function requireAdmin(): Promise<void> {
  const role = await requireAuthRole()
  if (role !== "admin") redirect("/")
}

export async function requireUser() {
  await requireAuthRole()
}
