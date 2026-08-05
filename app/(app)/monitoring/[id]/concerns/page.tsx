import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"
import { MonitoringConcernsPageForm } from "@/components/monitoring/MonitoringConcernsPageForm"
import { MonitoringPageNav } from "@/components/monitoring/MonitoringPageNav"
import {
  normalizeConcernEntriesFromRecord,
  normalizeHistoryEntriesFromRecord,
} from "@/lib/monitoring-entries"

export default async function MonitoringConcernsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const { error, message } = await searchParams
  const monitoringId = Number(id)

  if (Number.isNaN(monitoringId))
    return (
      <div>
        <p className="font-semibold text-red-500">Invalid ID</p>
        <BackButton href="/monitoring" />
      </div>
    )

  const { data: monitoring, error: fetchError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("id", monitoringId)
    .maybeSingle()

  if (fetchError || !monitoring)
    return (
      <div>
        <p className="font-semibold text-red-500">Record not found</p>
        <BackButton href="/monitoring" />
      </div>
    )

  const record = monitoring as Record<string, unknown>
  const initialConcerns = normalizeConcernEntriesFromRecord(record)
  const initialHistory = normalizeHistoryEntriesFromRecord(record)

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Concerns & History</h1>
          <div className="flex flex-wrap items-center gap-3">
            <MonitoringPageNav id={monitoringId} current="concerns" />
            <BackButton href="/monitoring" />
          </div>
        </div>

        {error === "save" && message && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">{decodeURIComponent(message)}</div>
        )}

        <MonitoringConcernsPageForm
          monitoringId={monitoringId}
          deploymentDate={record.deployment_date as string | null}
          lastStatusUpdate={record.last_status_update as string | null}
          initialConcerns={initialConcerns}
          initialHistory={initialHistory}
        />
      </div>
    </div>
  )
}
