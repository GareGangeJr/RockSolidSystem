import Link from "next/link"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { JobOrderDetailsView } from "@/components/job-orders/JobOrderDetailsView"

export const dynamic = "force-dynamic"

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
        <Link href="/apply/job-orders" className="mt-2 inline-block text-blue-600 hover:underline">
          Back to jobs
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
    .is("archived_at", null)
    .maybeSingle()

  if (error || !data) {
    return (
      <div>
        <p className="text-red-500">This job order is not available.</p>
        <Link href="/apply/job-orders" className="mt-2 inline-block text-blue-600 hover:underline">
          Back to jobs
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Job Details</h1>
        <Link href="/apply/job-orders" className="text-sm font-medium text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="space-y-6 p-4 sm:p-6">
          <JobOrderDetailsView jobOrder={data as Record<string, unknown>} showStatus={false} />
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-4 border-t border-gray-200 bg-slate-50 px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pt-6">
        <Link
          href={`/apply/applicants?job_order=${numericId}`}
          className="flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
        >
          Apply for this job
        </Link>
      </div>
    </div>
  )
}
