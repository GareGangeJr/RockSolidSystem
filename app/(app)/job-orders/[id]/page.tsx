import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"
import { JobOrderDetailsView } from "@/components/job-orders/JobOrderDetailsView"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const numericId = Number(id)

  if (Number.isNaN(numericId))
    return (
      <div className="p-6">
        <p className="font-semibold text-red-500">Invalid ID</p>
        <BackButton href="/job-orders" />
      </div>
    )

  const { data, error } = await supabase.from("job_orders").select("*").eq("id", numericId).maybeSingle()

  if (error || !data)
    return (
      <div className="p-6">
        <p className="font-semibold text-red-500">Not found</p>
        <BackButton href="/job-orders" />
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">View Job Order</h1>
          <BackButton href="/job-orders" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <JobOrderDetailsView jobOrder={data as Record<string, unknown>} />
          </div>
        </div>
      </div>
    </div>
  )
}
