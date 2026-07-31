import { createSupabaseServer } from "@/lib/supabase/server"
import { updateMonitoring } from "../../actions"
import { BackButton } from "@/components/BackButton"
import { MonitoringFormFields } from "@/components/monitoring/MonitoringFormFields"

export default async function EditMonitoringPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const monitoringId = Number(id)

  if (Number.isNaN(monitoringId))
    return (
      <div className="p-6">
        <p className="font-semibold text-red-500">Invalid ID</p>
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
      <div className="p-6">
        <p className="font-semibold text-red-500">Record not found</p>
        <BackButton href="/monitoring" />
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Edit Monitoring</h1>
          <BackButton href="/monitoring" />
        </div>

        <form action={updateMonitoring} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={monitoringId} />
          <div className="space-y-6 p-6">
            <MonitoringFormFields data={monitoring as Record<string, unknown>} />

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
