"use server"

import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type AttendanceLogType = "time_in" | "time_out"

async function getCurrentEmployee() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, employee: null, error: "You must be logged in." }

  const { data: employee } = await supabase
    .from("employees")
    .select("id, first_name, last_name, employment_status")
    .eq("auth_user_id", user.id)
    .maybeSingle()

  if (!employee) {
    return {
      supabase,
      employee: null,
      error: "No employee account linked to this login.",
    }
  }

  if (employee.employment_status === "Resigned" || employee.employment_status === "Terminated") {
    return {
      supabase,
      employee: null,
      error: "Your employee account is no longer active. Contact HR if you need access.",
    }
  }

  return { supabase, employee, error: null }
}

function getTodayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

export async function getMyAttendanceToday() {
  const { supabase, employee, error } = await getCurrentEmployee()
  if (error || !employee) return { error, employee: null }

  const { start, end } = getTodayRange()
  const { data: logs } = await supabase
    .from("attendance_logs")
    .select("id, log_type, logged_at")
    .eq("employee_id", employee.id)
    .gte("logged_at", start)
    .lte("logged_at", end)
    .order("logged_at", { ascending: true })

  const timeIn = logs?.find((log) => log.log_type === "time_in") ?? null
  const timeOut = logs?.find((log) => log.log_type === "time_out") ?? null

  return {
    error: null,
    employee,
    canTimeIn: !timeIn,
    canTimeOut: !!timeIn && !timeOut,
    timeIn,
    timeOut,
  }
}

export async function logAttendance(logType: AttendanceLogType) {
  if (process.env.NEXT_PUBLIC_ATTENDANCE_KIOSK !== "true") {
    return { error: "Time in/out is only available on the office attendance PC." }
  }

  const { supabase, employee, error } = await getCurrentEmployee()
  if (error || !employee) return { error }

  const { start, end } = getTodayRange()
  const { data: todayLogs } = await supabase
    .from("attendance_logs")
    .select("log_type")
    .eq("employee_id", employee.id)
    .gte("logged_at", start)
    .lte("logged_at", end)

  const hasTimeIn = todayLogs?.some((log) => log.log_type === "time_in")
  const hasTimeOut = todayLogs?.some((log) => log.log_type === "time_out")

  if (logType === "time_in") {
    if (hasTimeIn) return { error: "You already timed in today." }
  } else {
    if (!hasTimeIn) return { error: "You need to time in first." }
    if (hasTimeOut) return { error: "You already timed out today." }
  }

  const admin = createSupabaseAdmin()
  const { error: insertError } = await admin.from("attendance_logs").insert({
    employee_id: employee.id,
    log_type: logType,
  })

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath("/attendance")
  return { success: true }
}
