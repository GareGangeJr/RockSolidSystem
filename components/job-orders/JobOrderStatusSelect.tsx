"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { updateJobOrderStatus } from "@/app/(app)/job-orders/actions"
import { JOB_ORDER_STATUS_OPTIONS } from "@/lib/status-options"

type Props = {
  jobOrderId: number
  currentStatus: string | null
}

export default function JobOrderStatusSelect({ jobOrderId, currentStatus }: Props) {
  const router = useRouter()
  const [error, setError] = useState("")

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setError("")
    const { error: updateError } = await updateJobOrderStatus(jobOrderId, newStatus)
    if (updateError) {
      setError(updateError.message)
      e.target.value = currentStatus ?? "Open"
      return
    }
    router.refresh()
  }

  return (
    <div>
      <select
        value={currentStatus ?? "Open"}
        onChange={handleChange}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {JOB_ORDER_STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
