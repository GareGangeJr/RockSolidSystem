import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"
import { MonitoringDetailsView } from "@/components/monitoring/MonitoringDetailsView"
import { MonitoringPageNav } from "@/components/monitoring/MonitoringPageNav"

export default async function MonitoringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const monitoringId = Number(id)

  if (Number.isNaN(monitoringId))
    return (
      <div>
        <p className="font-semibold text-red-500">Invalid monitoring ID</p>
        <BackButton href="/monitoring" />
      </div>
    )

  const { data: monitoring, error } = await supabase
    .from("monitoring")
    .select("*")
    .eq("id", monitoringId)
    .maybeSingle()

  if (error || !monitoring)
    return (
      <div>
        <p className="font-semibold text-red-500">Record not found</p>
        <BackButton href="/monitoring" />
      </div>
    )

  const { data: applicant } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", monitoring.applicant_id)
    .maybeSingle()
  const { data: jobOrder } = await supabase
    .from("job_orders")
    .select("*")
    .eq("id", monitoring.job_order_id)
    .maybeSingle()

  const isArchived = Boolean(monitoring.archived_at)

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-gray-900">View Monitoring</h1>
          <div className="flex flex-wrap items-center gap-3">
            {!isArchived && <MonitoringPageNav id={monitoringId} current="view" />}
            <BackButton href={isArchived ? "/archive" : "/monitoring"} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <MonitoringDetailsView
              monitoring={monitoring as Record<string, unknown>}
              applicant={applicant}
              jobOrder={jobOrder}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
