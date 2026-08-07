"use server"

import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { logActivity } from "@/lib/activity-log"
import { assertOfficeNetwork } from "@/lib/kiosk-access"
import { revalidatePath } from "next/cache"

type AttendanceLogType = "time_in" | "time_out"

type EmployeeRow = {
  id: number
  first_name: string | null
  last_name: string | null
  employee_number: string | null
  employment_status: string | null
}

function normalizeEmployeeId(value: string) {
  return value.trim().toUpperCase()
}

async function getEmployeeByNumber(employeeNumber: string) {
  const normalized = normalizeEmployeeId(employeeNumber)
  if (!normalized) {
    return { employee: null, error: "Enter your Employee ID." }
  }

  const admin = createSupabaseAdmin()
  const { data: employee, error } = await admin
    .from("employees")
    .select("id, first_name, last_name, employee_number, employment_status, archived_at")
    .eq("employee_number", normalized)
    .maybeSingle()

  if (error) {
    return { employee: null, error: error.message }
  }

  if (!employee) {
    return { employee: null, error: "Employee ID not found." }
  }

  if (employee.archived_at) {
    return {
      employee: null,
      error: "This employee account is no longer active.",
    }
  }

  if (employee.employment_status === "Resigned" || employee.employment_status === "Terminated") {
    return {
      employee: null,
      error: "This employee account is no longer active.",
    }
  }

  return { employee: employee as EmployeeRow, error: null }
}

function getTodayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

async function getTodayLogsForEmployee(employeeId: number) {
  const admin = createSupabaseAdmin()
  const { start, end } = getTodayRange()
  const { data: logs } = await admin
    .from("attendance_logs")
    .select("id, log_type, logged_at")
    .eq("employee_id", employeeId)
    .gte("logged_at", start)
    .lte("logged_at", end)
    .order("logged_at", { ascending: true })

  const timeIn = logs?.find((log) => log.log_type === "time_in") ?? null
  const timeOut = logs?.find((log) => log.log_type === "time_out") ?? null

  return { timeIn, timeOut }
}

export async function getAttendanceToday(employeeNumber: string) {
  const network = await assertOfficeNetwork()
  if (!network.ok) return { error: network.error, employee: null }

  const { employee, error } = await getEmployeeByNumber(employeeNumber)
  if (error || !employee) return { error, employee: null }

  const { timeIn, timeOut } = await getTodayLogsForEmployee(employee.id)

  return {
    error: null,
    employee,
    canTimeIn: !timeIn,
    canTimeOut: !!timeIn && !timeOut,
    timeIn,
    timeOut,
  }
}

export async function logAttendance(logType: AttendanceLogType, employeeNumber: string) {
  const network = await assertOfficeNetwork()
  if (!network.ok) return { error: network.error }

  const { employee, error } = await getEmployeeByNumber(employeeNumber)
  if (error || !employee) return { error }

  const { timeIn, timeOut } = await getTodayLogsForEmployee(employee.id)

  if (logType === "time_in") {
    if (timeIn) return { error: "You already timed in today." }
  } else {
    if (!timeIn) return { error: "You need to time in first." }
    if (timeOut) return { error: "You already timed out today." }
  }

  const admin = createSupabaseAdmin()
  const { error: insertError } = await admin.from("attendance_logs").insert({
    employee_id: employee.id,
    log_type: logType,
  })

  if (insertError) {
    return { error: insertError.message }
  }

  const name = [employee.first_name, employee.last_name].filter(Boolean).join(" ")
  const actorLabel = employee.employee_number
    ? `${name || employee.employee_number} (${employee.employee_number})`
    : name || "Employee"

  await logActivity({
    action: logType,
    module: "attendance",
    recordId: employee.employee_number ?? employee.id,
    actorLabel,
  })

  revalidatePath("/attendance")
  return { success: true }
}
