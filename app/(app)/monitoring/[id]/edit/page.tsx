import { createSupabaseServer } from "@/lib/supabase/server"
import { updateMonitoring } from "../../actions"
import { BackButton } from "@/components/BackButton"
import { MonitoringFormFields } from "@/components/monitoring/MonitoringFormFields"
import { MonitoringPageNav } from "@/components/monitoring/MonitoringPageNav"
import { hasOpenConcern, normalizeConcernEntriesFromRecord } from "@/lib/monitoring-entries"

export default async function EditMonitoringPage({
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
  const openConcern = hasOpenConcern(normalizeConcernEntriesFromRecord(record))

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Edit Monitoring</h1>
          <div className="flex flex-wrap items-center gap-3">
            <MonitoringPageNav id={monitoringId} current="edit" />
            <BackButton href="/monitoring" />
          </div>
        </div>

        {error === "status" && message && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">{decodeURIComponent(message)}</div>
        )}

        <form action={updateMonitoring} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={monitoringId} />
          <div className="space-y-6 p-6">
            <MonitoringFormFields data={record} hasOpenConcern={openConcern} />

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
