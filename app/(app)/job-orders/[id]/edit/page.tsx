import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateJobOrder } from "../../actions"
import { COUNTRY_OPTIONS } from "@/lib/status-options"

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
      <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const { data, error } = await supabase.from("job_orders").select("*").eq("id", numericId).maybeSingle()

  if (error || !data) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Job order not found</p>
      <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
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
          <Link href="/job-orders" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to Job Orders
          </Link>
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
                  <select name="country" defaultValue={formatValue(data.country)} className={inputFieldStyles}>
                    <option value="">Select country...</option>
                    {COUNTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Job Title</label>
                  <input name="job_title" defaultValue={formatValue(data.job_title)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Status</label>
                  <select name="status" defaultValue={formatValue(data.status) || "Open"} className={inputFieldStyles}>
                    <option value="Open">Open</option>
                    <option value="Filled">Filled</option>
                    <option value="Closed">Closed</option>
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
                  <select name="gender" defaultValue={formatValue(data.gender)} className={inputFieldStyles}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Any">Any</option>
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
