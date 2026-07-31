"use client"

import { useEffect, useState } from "react"
import { getAttendanceToday, logAttendance } from "@/app/(app)/attendance/actions"
import { useRouter } from "next/navigation"

type TodayLog = {
  id: number
  log_type: string
  logged_at: string
}

type EmployeeInfo = {
  first_name: string | null
  last_name: string | null
  employee_number: string | null
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function employeeName(employee: EmployeeInfo | null) {
  if (!employee) return ""
  return [employee.first_name, employee.last_name].filter(Boolean).join(" ")
}

export default function AttendanceClock() {
  const router = useRouter()
  const [employeeId, setEmployeeId] = useState("")
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null)
  const [canTimeIn, setCanTimeIn] = useState(false)
  const [canTimeOut, setCanTimeOut] = useState(false)
  const [timeIn, setTimeIn] = useState<TodayLog | null>(null)
  const [timeOut, setTimeOut] = useState<TodayLog | null>(null)
  const [loading, setLoading] = useState<"lookup" | "time_in" | "time_out" | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const trimmed = employeeId.trim()
    if (!trimmed) {
      setEmployee(null)
      setCanTimeIn(false)
      setCanTimeOut(false)
      setTimeIn(null)
      setTimeOut(null)
      setError("")
      return
    }

    const timer = window.setTimeout(async () => {
      setLoading("lookup")
      setError("")

      const result = await getAttendanceToday(trimmed)

      if (result.error) {
        setEmployee(null)
        setCanTimeIn(false)
        setCanTimeOut(false)
        setTimeIn(null)
        setTimeOut(null)
        setError(result.error)
      } else {
        setEmployee(result.employee ?? null)
        setCanTimeIn(result.canTimeIn ?? false)
        setCanTimeOut(result.canTimeOut ?? false)
        setTimeIn(result.timeIn ?? null)
        setTimeOut(result.timeOut ?? null)
        setError("")
      }

      setLoading(null)
    }, 400)

    return () => window.clearTimeout(timer)
  }, [employeeId])

  async function handleLog(logType: "time_in" | "time_out") {
    setLoading(logType)
    setError("")

    const result = await logAttendance(logType, employeeId)

    if (result.error) {
      setError(result.error)
      setLoading(null)
      return
    }

    const refreshed = await getAttendanceToday(employeeId)
    if (!refreshed.error && refreshed.employee) {
      setEmployee(refreshed.employee)
      setCanTimeIn(refreshed.canTimeIn ?? false)
      setCanTimeOut(refreshed.canTimeOut ?? false)
      setTimeIn(refreshed.timeIn ?? null)
      setTimeOut(refreshed.timeOut ?? null)
    }

    router.refresh()
    setLoading(null)
  }

  const isBusy = loading !== null

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Record Attendance</h2>

      <div className="mt-4">
        <label htmlFor="attendance-employee-id" className="mb-1 block text-sm font-medium text-gray-700">
          Employee ID
        </label>
        <input
          id="attendance-employee-id"
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
          placeholder="EMP-2026-001"
          autoComplete="off"
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-base uppercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {employee && (
        <p className="mt-3 text-sm text-gray-700">
          <span className="font-medium">{employeeName(employee)}</span>
          {employee.employee_number ? (
            <span className="text-gray-500"> · {employee.employee_number}</span>
          ) : null}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleLog("time_in")}
          disabled={!employeeId.trim() || !canTimeIn || isBusy}
          className="rounded-md bg-green-600 px-6 py-4 text-base font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "time_in" ? "Saving..." : "Time In"}
        </button>
        <button
          type="button"
          onClick={() => handleLog("time_out")}
          disabled={!employeeId.trim() || !canTimeOut || isBusy}
          className="rounded-md bg-orange-600 px-6 py-4 text-base font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "time_out" ? "Saving..." : "Time Out"}
        </button>
      </div>

      <div className="mt-4 space-y-2 rounded-md bg-gray-50 p-4 text-sm">
        <p>
          <span className="font-medium">Time In:</span>{" "}
          {loading === "lookup" ? "Checking..." : timeIn ? formatTime(timeIn.logged_at) : "Not yet"}
        </p>
        <p>
          <span className="font-medium">Time Out:</span>{" "}
          {loading === "lookup" ? "Checking..." : timeOut ? formatTime(timeOut.logged_at) : "Not yet"}
        </p>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
