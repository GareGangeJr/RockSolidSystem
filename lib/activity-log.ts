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

/**
 * Writes an activity log entry. Returns false if auditing failed.
 * Callers may keep the business action successful (best-effort audit),
 * but should treat a false return as an incomplete audit trail.
 */
export async function logActivity(input: ActivityLogInput): Promise<boolean> {
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
      console.error("[activity-log] write failed:", {
        action: input.action,
        module: input.module,
        recordId: input.recordId,
        message: error.message,
      })
      return false
    }

    return true
  } catch (error) {
    console.error("[activity-log] unexpected failure:", {
      action: input.action,
      module: input.module,
      recordId: input.recordId,
      error,
    })
    return false
  }
}
