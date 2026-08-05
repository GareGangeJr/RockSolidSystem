"use client"

import { fieldClassSm, labelClassSm } from "@/lib/form-ui"

export type OpenJobOrderOption = {
  id: number
  job_title: string | null
  company: string | null
  country: string | null
}

const labelStyles = labelClassSm
const inputFieldStyles = fieldClassSm

type JobOrderSelectFieldProps = {
  jobOrders: OpenJobOrderOption[]
  defaultJobOrderId?: number
  required?: boolean
  onJobOrderChange?: (jobOrder: OpenJobOrderOption | null) => void
}

export function JobOrderSelectField({
  jobOrders,
  defaultJobOrderId,
  required = false,
  onJobOrderChange,
}: JobOrderSelectFieldProps) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const id = Number(event.target.value)
    if (!onJobOrderChange) return
    if (!id) {
      onJobOrderChange(null)
      return
    }
    onJobOrderChange(jobOrders.find((job) => job.id === id) ?? null)
  }

  return (
    <div>
      <label className={labelStyles}>Job Order Applying For</label>
      <select
        name="job_order_id"
        className={inputFieldStyles}
        defaultValue={defaultJobOrderId ? String(defaultJobOrderId) : ""}
        onChange={handleChange}
        required={required}
      >
        <option value="">Select a job order</option>
        {jobOrders.map((job) => {
          const title = job.job_title ?? "Untitled"
          const label = job.country ? `${job.id} - ${title} - ${job.country}` : `${job.id} - ${title}`

          return (
            <option key={job.id} value={job.id}>
              {label}
            </option>
          )
        })}
      </select>
    </div>
  )
}
