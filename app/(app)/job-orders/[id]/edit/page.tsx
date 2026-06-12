import { createSupabaseServer } from "@/lib/supabase/server"
import { updateJobOrder } from "../../actions"
import { JOB_ORDER_STATUS_OPTIONS, JOB_ORDER_GENDER_OPTIONS, DEFAULT_JOB_ORDER_STATUS, DEFAULT_JOB_ORDER_GENDER } from "@/lib/status-options"
import { BackButton } from "@/components/BackButton"
const formatValue = (x: unknown) => (x != null ? String(x) : "")

export default async function EditJobOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const numericId = Number(id)

  if (Number.isNaN(numericId)) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Invalid ID</p>
      <BackButton href="/job-orders" />
    </div>
  )

  const { data, error } = await supabase.from("job_orders").select("*").eq("id", numericId).maybeSingle()

  if (error || !data) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Job order not found</p>
      <BackButton href="/job-orders" />
    </div>
  )

  const inputFieldStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelStyles = "block text-sm font-medium text-gray-700"
  const sectionHeaderStyles = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridLayoutStyles = "grid grid-cols-12 gap-4"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Edit Job Order</h1>
          <BackButton href="/job-orders" />
        </div>

        <form action={updateJobOrder} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={data.id} />
          <div className="space-y-6 p-6">
            <div>
              <h2 className={sectionHeaderStyles}>Job Order Details</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Company Name</label>
                  <input name="company" defaultValue={formatValue(data.company)} className={inputFieldStyles} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Country</label>
                  <input name="country" type="text" defaultValue={formatValue(data.country)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Job Title</label>
                  <input name="job_title" defaultValue={formatValue(data.job_title)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Status</label>
                  <select name="status" defaultValue={formatValue(data.status) || DEFAULT_JOB_ORDER_STATUS} className={inputFieldStyles}>
                    {JOB_ORDER_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Requirements</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Sex</label>
                  <select name="gender" defaultValue={formatValue(data.gender) || DEFAULT_JOB_ORDER_GENDER} className={inputFieldStyles}>
                    {JOB_ORDER_GENDER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Number of Workers</label>
                  <input
                    name="no_workers"
                    type="number"
                    defaultValue={Number(data.no_workers) || 1}
                    min={1}
                    className={inputFieldStyles}
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Years Experience Required</label>
                  <input
                    name="years_exp_required"
                    type="number"
                    defaultValue={Number(data.years_exp_required) || 0}
                    min={0}
                    className={inputFieldStyles}
                  />
                </div>
                <div className="col-span-12">
                  <label className={labelStyles}>Skills Required</label>
                  <input
                    name="skills_required"
                    defaultValue={formatValue(data.skills_required)}
                    className={inputFieldStyles}
                    placeholder="e.g. Cooking, Cleaning"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Compensation</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Basic Salary</label>
                  <input name="salary" defaultValue={formatValue(data.salary)} className={inputFieldStyles} placeholder="e.g. 1500 SAR" />
                </div>
              </div>
            </div>

            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
