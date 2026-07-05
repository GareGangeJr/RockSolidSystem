import { createSupabaseServer } from "@/lib/supabase/server"
import { MonitoringTable } from "@/components/monitoring/MonitoringTable"
import type { MonitoringRecord } from "@/types/entities"

export default async function MonitoringPage() {
  const supabase = await createSupabaseServer()

  const { data: monitoringRecords, error: monitoringError } = await supabase
    .from("monitoring")
    .select("*")
    .order("deployment_date", { ascending: false })

  if (monitoringError) return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Monitoring</h1>
      <p className="text-red-500">Error: {monitoringError.message}</p>
    </div>
  )

  const applicantIds = monitoringRecords?.map((r) => r.applicant_id) ?? []
  const jobOrderIds = monitoringRecords?.map((r) => r.job_order_id) ?? []

  const { data: applicants } = await supabase
    .from("applicants")
    .select("id, first_name, last_name")
    .in("id", applicantIds.length > 0 ? applicantIds : [0])

  const { data: jobOrders } = await supabase
    .from("job_orders")
    .select("id, job_title, country")
    .in("id", jobOrderIds.length > 0 ? jobOrderIds : [0])

  const records: MonitoringRecord[] =
    monitoringRecords?.map((m) => {
      const applicant = applicants?.find((a) => a.id === m.applicant_id)
      const jobOrder = jobOrders?.find((j) => j.id === m.job_order_id)
      return { ...m, applicant, jobOrder }
    }) ?? []

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deployment Monitoring</h1>
      <MonitoringTable records={records} />
    </div>
  )
}
   