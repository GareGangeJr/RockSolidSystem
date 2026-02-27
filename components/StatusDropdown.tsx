"use client"

import { updateApplicantStatus } from "@/app/(app)/applicants/actions"
import { STATUS_OPTIONS } from "@/lib/status-options"

type Props = {
  applicantId: number
  currentStatus: string | null
}

export default function StatusDropdown({ applicantId, currentStatus }: Props) {
  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    
    // Confirm deployment status changes
    if (newStatus === "Deployed" || newStatus === "Deployed(With Concerns)") {
      const confirmed = confirm(
        `Are you sure you want to change status to "${newStatus}"? This will add the applicant to the Monitoring page.`
      )
      if (!confirmed) {
        e.target.value = currentStatus ?? "New Applicant"
        return
      }
    }
    
    const { error } = await updateApplicantStatus(applicantId, newStatus)
    if (error) {
      alert(error.message || "Error updating status")
      e.target.value = currentStatus ?? "New Applicant"
    } else {
      alert("Status updated successfully!")
      window.location.reload()
    }
  }

  const isInList = STATUS_OPTIONS.includes(currentStatus as (typeof STATUS_OPTIONS)[number])
  const options = currentStatus && !isInList
    ? [currentStatus, ...STATUS_OPTIONS]
    : [...STATUS_OPTIONS]

  return (
    <select
      value={currentStatus ?? "New Applicant"}
      onChange={handleChange}
      className="w-full max-w-[180px] border border-gray-300 rounded px-2 py-1 text-sm"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
