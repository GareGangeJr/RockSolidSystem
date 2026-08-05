"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { updateApplicantStatus } from "@/app/(app)/applicants/actions"
import { getSelectableApplicantStatusOptions } from "@/lib/status-options"

type Props = {
  applicantId: number
  currentStatus: string | null
}

export function ApplicantStatusSelect({ applicantId, currentStatus }: Props) {
  const router = useRouter()
  const [error, setError] = useState("")

  const selectable = getSelectableApplicantStatusOptions(currentStatus)
  const options =
    currentStatus && !selectable.includes(currentStatus)
      ? [currentStatus, ...selectable]
      : selectable

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setError("")

    const { error: updateError } = await updateApplicantStatus(applicantId, newStatus)
    if (updateError) {
      setError(updateError.message)
      e.target.value = currentStatus ?? "New Applicant"
      return
    }

    router.refresh()
  }

  return (
    <div>
      <select
        value={currentStatus ?? "New Applicant"}
        onChange={handleChange}
        className="min-w-[150px] rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
