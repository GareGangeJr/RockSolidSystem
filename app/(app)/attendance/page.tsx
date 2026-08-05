import { createSupabaseServer } from "@/lib/supabase/server"
import AttendanceList, { type AttendanceListRow } from "@/components/AttendanceList"

export default async function AttendancePage() {
  const supabase = await createSupabaseServer()

  const { data: logs, error } = await supabase
    .from("attendance_logs")
    .select("id, employee_id, log_type, logged_at")
    .order("logged_at", { ascending: false })
    .limit(200)

  const employeeIds = [...new Set((logs ?? []).map((log) => log.employee_id))]
  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name, employee_number")
    .in("id", employeeIds.length > 0 ? employeeIds : [0])

  const rows: AttendanceListRow[] = (logs ?? []).map((log) => {
    const employee = employees?.find((item) => item.id === log.employee_id)
    const name = [employee?.first_name, employee?.last_name].filter(Boolean).join(" ") || "Unknown"

    return {
      id: log.id,
      employeeName: name,
      employeeNumber: employee?.employee_number ?? null,
      logType: log.log_type,
      loggedAt: log.logged_at,
    }
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Attendance Logs</h2>
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Could not load attendance logs.
          </div>
        ) : (
          <AttendanceList rows={rows} />
        )}
      </div>
    </div>
  )
}
