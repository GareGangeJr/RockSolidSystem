import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

const formatValue = (x: unknown) => (x != null && x !== "" ? String(x) : "--")

export default async function Page({
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
      <p className="font-semibold text-red-500">Not found</p>
      <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const jobOrder = data as Record<string, unknown>

  const labelStyles = "block text-xs font-medium text-gray-500"
  const valueStyles = "mt-0.5 text-sm text-gray-900"
  const sectionHeaderStyles = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridLayoutStyles = "grid grid-cols-12 gap-4"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">View Job Order</h1>
          <Link href="/job-orders" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to Job Orders
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <div>
              <h2 className={sectionHeaderStyles}>Job Order Details</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>ID</span>
                  <p className={valueStyles}>JO-{formatValue(jobOrder.id)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Company Name</span>
                  <p className={valueStyles}>{formatValue(jobOrder.company)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Country</span>
                  <p className={valueStyles}>{formatValue(jobOrder.country)}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelStyles}>Job Title</span>
                  <p className={valueStyles}>{formatValue(jobOrder.job_title)}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelStyles}>Status</span>
                  <p className={valueStyles}>{formatValue(jobOrder.status)}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Requirements</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Sex</span>
                  <p className={valueStyles}>{formatValue(jobOrder.gender)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Number of Workers</span>
                  <p className={valueStyles}>{jobOrder.no_workers != null ? String(jobOrder.no_workers) : "--"}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Years Experience Required</span>
                  <p className={valueStyles}>{jobOrder.years_exp_required != null ? String(jobOrder.years_exp_required) : "--"}</p>
                </div>
                <div className="col-span-12">
                  <span className={labelStyles}>Skills Required</span>
                  <p className={valueStyles}>{formatValue(jobOrder.skills_required)}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Salary</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelStyles}>Basic Salary</span>
                  <p className={valueStyles}>{formatValue(jobOrder.salary)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
