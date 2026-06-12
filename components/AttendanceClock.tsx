"use client"

import { useState, type ReactNode } from "react"
import { logAttendance } from "@/app/(app)/attendance/actions"
import { useRouter } from "next/navigation"

type TodayLog = {
  id: number
  log_type: string
  logged_at: string
  branch_name: string | null
  location_status: string
  distance_meters: number | null
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

function permissionDeniedMessage() {
  return (
    <>
      <span className="font-medium">Location is blocked.</span> Allow location for this site, then try again.
      <span className="mt-2 block text-gray-700">
        1. Click the lock icon in the address bar → Location → Allow
        <br />
        2. On Windows: Settings → Privacy → Location → turn Location on
        <br />
        3. Use <span className="font-medium">http://localhost:3000</span> instead of a 192.168 address
        <br />
        4. Refresh this page, then tap Time In again and choose Allow
      </span>
    </>
  )
}

async function getPermissionState(): Promise<PermissionState | "unsupported"> {
  if (!navigator.permissions?.query) return "unsupported"
  try {
    const result = await navigator.permissions.query({ name: "geolocation" })
    return result.state
  } catch {
    return "unsupported"
  }
}

function requestPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

async function getCurrentPosition(): Promise<GeolocationPosition> {
  if (!navigator.geolocation) {
    throw Object.assign(new Error("GPS is not supported on this device."), { code: 0 })
  }

  if (!window.isSecureContext) {
    throw Object.assign(
      new Error("Location only works on localhost or HTTPS. Open http://localhost:3000 instead of an IP address."),
      { code: 0 }
    )
  }

  const permission = await getPermissionState()
  if (permission === "denied") {
    throw Object.assign(new Error("Location permission denied."), { code: 1 })
  }

  const attempts: PositionOptions[] = [
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    { enableHighAccuracy: false, timeout: 25000, maximumAge: 60000 },
    { enableHighAccuracy: false, timeout: 30000, maximumAge: 120000 },
  ]

  let lastError: GeolocationPositionError | null = null

  for (const options of attempts) {
    try {
      return await requestPosition(options)
    } catch (err) {
      const geoError = err as GeolocationPositionError
      lastError = geoError
      if (geoError.code === 1) break
    }
  }

  throw lastError ?? Object.assign(new Error("Could not get your location."), { code: 2 })
}

function getGeoErrorMessage(err: unknown) {
  const code = typeof err === "object" && err !== null && "code" in err ? Number(err.code) : 0
  const message = err instanceof Error ? err.message : "Could not get your location. Try again at the office."

  if (code === 1) return permissionDeniedMessage()
  if (code === 2) {
    return "Could not detect your location. Move near a window, turn on Windows Location, and try again."
  }
  if (code === 3) {
    return "Location took too long. Stay on this page and try again — the app will retry automatically."
  }
  return message || "Could not get your location. Try again at the office."
}

export default function AttendanceClock({
  canTimeIn,
  canTimeOut,
  timeIn,
  timeOut,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<"time_in" | "time_out" | null>(null)
  const [error, setError] = useState<ReactNode>("")

  async function handleLog(logType: "time_in" | "time_out") {
    setLoading(logType)
    setError("")

    try {
      const position = await getCurrentPosition()
      const result = await logAttendance(
        logType,
        position.coords.latitude,
        position.coords.longitude
      )

      if (result.error) {
        setError(result.error)
        return
      }

      router.refresh()
    } catch (err) {
      setError(getGeoErrorMessage(err))
    } finally {
      setLoading(null)
    }
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
          {loading === "time_in" ? "Checking location..." : "Time In"}
        </button>
        <button
          type="button"
          onClick={() => handleLog("time_out")}
          disabled={!canTimeOut || loading !== null}
          className="rounded-md bg-orange-600 px-6 py-4 text-base font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "time_out" ? "Checking location..." : "Time Out"}
        </button>
      </div>

      <div className="mt-4 space-y-2 rounded-md bg-gray-50 p-4 text-sm">
        <p>
          <span className="font-medium">Time In:</span>{" "}
          {timeIn ? `${formatTime(timeIn.logged_at)} at ${timeIn.branch_name}` : "Not yet"}
        </p>
        <p>
          <span className="font-medium">Time Out:</span>{" "}
          {timeOut ? `${formatTime(timeOut.logged_at)} at ${timeOut.branch_name}` : "Not yet"}
        </p>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
