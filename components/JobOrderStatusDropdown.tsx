"use client"

import { updateJobOrderStatus } from "@/app/(app)/job-orders/actions"
import { JOB_ORDER_STATUS_OPTIONS } from "@/lib/status-options"
import { useRouter } from "next/navigation"

type Props = {
  jobOrderId: number
  currentStatus: string | null
}

export default function JobOrderStatusDropdown({ jobOrderId, currentStatus }: Props) {
  const router = useRouter()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    const { error } = await updateJobOrderStatus(jobOrderId, newStatus)
    if (error) {
      alert(error.message || "Error updating status")
      e.target.value = currentStatus ?? "Open"
    } else {
      router.refresh()
    }
  }

  const options = currentStatus && !JOB_ORDER_STATUS_OPTIONS.includes(currentStatus as (typeof JOB_ORDER_STATUS_OPTIONS)[number])
    ? [currentStatus, ...JOB_ORDER_STATUS_OPTIONS]
    : JOB_ORDER_STATUS_OPTIONS

  return (
    <select
      value={currentStatus ?? "Open"}
      onChange={handleChange}
      className="w-full max-w-[140px] border border-gray-300 rounded px-2 py-1 text-sm"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}
