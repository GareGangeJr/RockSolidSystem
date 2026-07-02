"use client"

import { useState } from "react"
import { logAttendance } from "@/app/(app)/attendance/actions"
import { useRouter } from "next/navigation"

type TodayLog = {
  id: number
  log_type: string
  logged_at: string
}

type Props = {
  canTimeIn: boolean
  canTimeOut: boolean
  timeIn: TodayLog | null
  timeOut: TodayLog | null
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function AttendanceClock({
  canTimeIn,
  canTimeOut,
  timeIn,
  timeOut,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<"time_in" | "time_out" | null>(null)
  const [error, setError] = useState("")

  async function handleLog(logType: "time_in" | "time_out") {
    setLoading(logType)
    setError("")

    const result = await logAttendance(logType)

    if (result.error) {
      setError(result.error)
      setLoading(null)
      return
    }

    router.refresh()
    setLoading(null)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">My Attendance</h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleLog("time_in")}
          disabled={!canTimeIn || loading !== null}
          className="rounded-md bg-green-600 px-6 py-4 text-base font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "time_in" ? "Saving..." : "Time In"}
        </button>
        <button
          type="button"
          onClick={() => handleLog("time_out")}
          disabled={!canTimeOut || loading !== null}
          className="rounded-md bg-orange-600 px-6 py-4 text-base font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "time_out" ? "Saving..." : "Time Out"}
        </button>
      </div>

      <div className="mt-4 space-y-2 rounded-md bg-gray-50 p-4 text-sm">
        <p>
          <span className="font-medium">Time In:</span>{" "}
          {timeIn ? formatTime(timeIn.logged_at) : "Not yet"}
        </p>
        <p>
          <span className="font-medium">Time Out:</span>{" "}
          {timeOut ? formatTime(timeOut.logged_at) : "Not yet"}
        </p>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
