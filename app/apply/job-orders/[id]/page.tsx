import Link from "next/link"
import { createSupabaseAdmin } from "@/lib/supabase/admin"

const formatValue = (x: unknown) => (x != null && x !== "" ? String(x) : "--")

export default async function PublicJobOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numericId = Number(id)

  if (Number.isNaN(numericId)) {
    return (
      <div>
        <p className="text-red-500">Invalid job order.</p>
        <Link href="/apply/job-orders" className="text-blue-600 hover:underline">
          Back to job orders
        </Link>
      </div>
    )
  }

  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from("job_orders")
    .select("*")
    .eq("id", numericId)
    .eq("status", "Open")
    .maybeSingle()

  if (error || !data) {
    return (
      <div>
        <p className="text-red-500">This job order is not available.</p>
        <Link href="/apply/job-orders" className="text-blue-600 hover:underline">
          Back to job orders
        </Link>
      </div>
    )
  }

  const jobOrder = data as Record<string, unknown>
  const labelStyles = "block text-xs font-medium text-gray-500"
  const valueStyles = "mt-0.5 text-sm text-gray-900"
  const sectionHeaderStyles =
    "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridLayoutStyles = "grid grid-cols-12 gap-4"

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Job Order Details</h1>
        <Link
          href="/apply/job-orders"
          className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          Back
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
                <p className={valueStyles}>
                  {jobOrder.no_workers != null ? String(jobOrder.no_workers) : "--"}
                </p>
              </div>
              <div className="col-span-12 md:col-span-4">
                <span className={labelStyles}>Years Experience Required</span>
                <p className={valueStyles}>
                  {jobOrder.years_exp_required != null ? String(jobOrder.years_exp_required) : "--"}
                </p>
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

      <div className="mt-6">
        <Link
          href={`/apply/applicants?job_order=${numericId}`}
          className="inline-flex rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Apply for this job
        </Link>
      </div>
    </div>
  )
}
