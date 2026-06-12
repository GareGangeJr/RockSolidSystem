"use client"

export type OpenJobOrderOption = {
  id: number
  job_title: string | null
  company: string | null
  country: string | null
}

const inputFieldStyles =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
const labelStyles = "block text-sm font-medium text-gray-700"

type JobOrderSelectFieldProps = {
  jobOrders: OpenJobOrderOption[]
  defaultJobOrderId?: number
  onJobOrderChange?: (jobOrder: OpenJobOrderOption | null) => void
}

export function JobOrderSelectField({
  jobOrders,
  defaultJobOrderId,
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
    <div className="col-span-12 md:col-span-6">
      <label className={labelStyles}>Job Order Applying For</label>
      <select
        name="job_order_id"
        className={inputFieldStyles}
        defaultValue={defaultJobOrderId ? String(defaultJobOrderId) : ""}
        onChange={handleChange}
      >
        <option value="">Select a job order</option>
        {jobOrders.map((job) => (
          <option key={job.id} value={job.id}>
            JO-{job.id} — {job.job_title ?? "Untitled"}
          </option>
        ))}
      </select>
    </div>
  )
}
