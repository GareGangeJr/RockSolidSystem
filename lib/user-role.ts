import type { SupabaseClient } from "@supabase/supabase-js"

export type AccessRole = "admin" | "staff"

export const STAFF_NAV_PATHS = [
  "/",
  "/applicants",
  "/job-orders",
  "/monitoring",
  "/attendance",
] as const

const ADMIN_ONLY_PREFIXES = ["/employees", "/reports", "/api/reports"]

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

export function isStaffPathAllowed(path: string): boolean {
  if (path === "/") return true
  return STAFF_NAV_PATHS.some(
    (allowed) => allowed !== "/" && (path === allowed || path.startsWith(`${allowed}/`))
  )
}

export function isAdminOnlyPath(path: string): boolean {
  return ADMIN_ONLY_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
}

export function canAccessPath(role: AccessRole, path: string): boolean {
  if (role === "admin") return true
  if (isAdminOnlyPath(path)) return false
  return isStaffPathAllowed(path)
}
