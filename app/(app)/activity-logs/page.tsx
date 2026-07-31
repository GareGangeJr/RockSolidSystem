import ActivityLogList, { type ActivityLogRow } from "@/components/ActivityLogList"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/require-role"

export default async function ActivityLogsPage() {
  await requireAdmin()
  const admin = createSupabaseAdmin()

  const { data: logs, error } = await admin
    .from("activity_logs")
    .select("id, user_label, user_role, action, module, record_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(500)

  const rows: ActivityLogRow[] = (logs ?? []).map((log) => ({
    id: log.id,
    userLabel: log.user_label,
    userRole: log.user_role,
    action: log.action,
    module: log.module,
    recordId: log.record_id,
    details: (log.details as Record<string, unknown>) ?? {},
    createdAt: log.created_at,
  }))

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Could not load activity logs.
          {error.message.includes("activity_logs") && (
            <span> Run supabase/activity_logs.sql in Supabase SQL Editor first.</span>
          )}
        </div>
      ) : (
        <ActivityLogList rows={rows} />
      )}
    </div>
  )
}
