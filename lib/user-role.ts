import type { SupabaseClient } from "@supabase/supabase-js"

export type AccessRole = "admin" | "staff"

const ADMIN_ONLY_PREFIXES = ["/employees", "/reports", "/activity-logs", "/api/reports"]

export async function getAccessRole(
  supabase: SupabaseClient,
  userId: string | undefined
): Promise<AccessRole | null> {
  if (!userId) return null

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("auth_user_id", userId)
    .maybeSingle()

  return employee ? "staff" : "admin"
}

export function isAdminOnlyPath(path: string): boolean {
  return ADMIN_ONLY_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
}
