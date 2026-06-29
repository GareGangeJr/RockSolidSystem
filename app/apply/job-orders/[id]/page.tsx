import Link from "next/link"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { JobOrderDetailsView } from "@/components/job-orders/JobOrderDetailsView"

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
        <div className="p-6">
          <JobOrderDetailsView jobOrder={data as Record<string, unknown>} showStatus={false} />
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
