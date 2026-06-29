import { createSupabaseServer } from "@/lib/supabase/server"
import { getAccessRole } from "@/lib/user-role"
import AttendanceClock from "@/components/AttendanceClock"
import AttendanceList, { type AttendanceListRow } from "@/components/AttendanceList"
import { getMyAttendanceToday } from "./actions"

export default async function AttendancePage() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const role = await getAccessRole(supabase, user?.id)
  const myAttendance = role === "staff" ? await getMyAttendanceToday() : null

  const { data: logs, error } = await supabase
    .from("attendance_logs")
    .select("id, employee_id, log_type, logged_at, branch_name, location_status, distance_meters, latitude, longitude")
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
      employeeId: log.employee_id,
      employeeName: name,
      employeeNumber: employee?.employee_number ?? null,
      logType: log.log_type,
      loggedAt: log.logged_at,
      branchName: log.branch_name,
      locationStatus: log.location_status,
      distanceMeters: log.distance_meters,
      latitude: log.latitude,
      longitude: log.longitude,
    }
  })

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
      </div>

      {role === "staff" && myAttendance && (
        <>
          {myAttendance.error ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {myAttendance.error}
            </div>
          ) : myAttendance.employee ? (
            <AttendanceClock
              canTimeIn={myAttendance.canTimeIn ?? false}
              canTimeOut={myAttendance.canTimeOut ?? false}
              timeIn={myAttendance.timeIn}
              timeOut={myAttendance.timeOut}
            />
          ) : null}
        </>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Attendance Logs</h2>
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Could not load attendance logs. Run{" "}
            <code className="font-mono">supabase/migrations/20250627_attendance_logs.sql</code> in
            Supabase SQL Editor first.
          </div>
        ) : (
          <AttendanceList rows={rows} />
        )}
      </div>
    </div>
  )
}
