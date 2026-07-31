import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServer } from "@/lib/supabase/server"
import { normalizeActivityRecordId } from "@/lib/activity-log-format"
import { getAccessRole } from "@/lib/user-role"

export type ActivityLogInput = {
  action: string
  module: string
  recordId?: string | number | null
  details?: Record<string, unknown>
  actorLabel?: string
}

export async function logActivity(input: ActivityLogInput) {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let userLabel = input.actorLabel ?? "System"
    let userEmail: string | null = null
    let userId: string | null = null
    let userRole: string | null = null

    if (user) {
      userId = user.id
      userEmail = user.email ?? null
      userRole = await getAccessRole(supabase, user.id)

      if (!input.actorLabel) {
        userLabel = user.email ?? "Unknown user"

        if (userRole === "staff") {
          const { data: emp } = await supabase
            .from("employees")
            .select("first_name, last_name, employee_number")
            .eq("auth_user_id", user.id)
            .maybeSingle()

          if (emp) {
            const name = [emp.first_name, emp.last_name].filter(Boolean).join(" ")
            if (name) {
              userLabel = emp.employee_number ? `${name} (${emp.employee_number})` : name
            }
          }
        }
      }
    }

    const admin = createSupabaseAdmin()
    const { error } = await admin.from("activity_logs").insert({
      user_id: userId,
      user_email: userEmail,
      user_label: userLabel,
      user_role: userRole,
      action: input.action,
      module: input.module,
      record_id: normalizeActivityRecordId(input.module, input.recordId, input.details),
      details: input.details ?? {},
    })

    if (error) {
      console.error("Failed to write activity log:", error.message)
    }
  } catch (error) {
    console.error("Failed to write activity log:", error)
  }
}
