"use client"

import { updateEmployeeStatus } from "@/app/(app)/employees/actions"
import { EMPLOYMENT_STATUS_OPTIONS } from "@/lib/status-options"
import { useRouter } from "next/navigation"

type Props = {
  employeeId: number
  currentStatus: string | null
}

export default function EmployeeStatusDropdown({ employeeId, currentStatus }: Props) {
  const router = useRouter()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    const { error } = await updateEmployeeStatus(employeeId, newStatus)
    if (error) {
      alert(error.message || "Error updating status")
      e.target.value = currentStatus ?? "Active"
    } else {
      router.refresh()
    }
  }

  const options = currentStatus && !EMPLOYMENT_STATUS_OPTIONS.includes(currentStatus as (typeof EMPLOYMENT_STATUS_OPTIONS)[number])
    ? [currentStatus, ...EMPLOYMENT_STATUS_OPTIONS]
    : EMPLOYMENT_STATUS_OPTIONS

  return (
    <select
      value={currentStatus ?? "Active"}
      onChange={handleChange}
      className="w-full max-w-[140px] border border-gray-300 rounded px-2 py-1 text-sm"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}
