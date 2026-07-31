import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"
import { updateMonitoringConcerns } from "../../actions"
import { MonitoringConcernsHistoryForm } from "@/components/monitoring/MonitoringConcernsHistoryForm"
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
      <div className="p-6">
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
      <div className="p-6">
        <p className="font-semibold text-red-500">Record not found</p>
        <BackButton href="/monitoring" />
      </div>
    )

  const record = monitoring as Record<string, unknown>
  const initialConcerns = normalizeConcernEntriesFromRecord(record)
  const initialHistory = normalizeHistoryEntriesFromRecord(record)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Concerns & History</h1>
          <BackButton href="/monitoring" />
        </div>

        {error === "save" && message && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">{decodeURIComponent(message)}</div>
        )}

        <form action={updateMonitoringConcerns} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={monitoringId} />
          <div className="space-y-6 p-6">
            <MonitoringConcernsHistoryForm
              deploymentDate={record.deployment_date as string | null}
              lastStatusUpdate={record.last_status_update as string | null}
              initialConcerns={initialConcerns}
              initialHistory={initialHistory}
            />

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
