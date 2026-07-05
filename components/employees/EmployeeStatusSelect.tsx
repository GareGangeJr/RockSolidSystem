"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { updateEmployeeStatus } from "@/app/(app)/employees/actions"
import { EMPLOYMENT_STATUS_OPTIONS } from "@/lib/status-options"

type Props = {
  employeeId: number
  currentStatus: string | null
}

export default function EmployeeStatusSelect({ employeeId, currentStatus }: Props) {
  const router = useRouter()
  const [error, setError] = useState("")

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setError("")
    const result = await updateEmployeeStatus(employeeId, newStatus)
    if (result.error) {
      setError(result.error.message)
      e.target.value = currentStatus ?? "Active"
      return
    }
    router.refresh()
  }

  return (
    <div>
      <select
        value={currentStatus ?? "Active"}
        onChange={handleChange}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {EMPLOYMENT_STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
