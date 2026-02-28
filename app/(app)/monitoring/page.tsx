import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

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

  const applicantIds = monitoringRecords?.map((r: any) => r.applicant_id) || []
  const jobOrderIds = monitoringRecords?.map((r: any) => r.job_order_id) || []

  const { data: applicants } = await supabase
    .from("applicants")
    .select("id, first_name, last_name")
    .in("id", applicantIds.length > 0 ? applicantIds : [0])

  const { data: jobOrders } = await supabase
    .from("job_orders")
    .select("id, job_title, country")
    .in("id", jobOrderIds.length > 0 ? jobOrderIds : [0])

  const records = monitoringRecords?.map((m: any) => {
    const applicant = applicants?.find((a: any) => a.id === m.applicant_id)
    const jobOrder = jobOrders?.find((j: any) => j.id === m.job_order_id)
    return { ...m, applicant, jobOrder }
  }) || []

  const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString() : "—"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deployment Monitoring</h1>

      {records.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Applicant</th>
                <th className="p-3 text-left">Job Order</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Deployment Status</th>
                <th className="p-3 text-left">Deployed Date</th>
                <th className="p-3 text-left">Concern Status</th>
                <th className="p-3 text-left">Return Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">
                    <div>{r.applicant?.id}</div>
                    <div className="text-xs text-gray-500">{r.applicant?.first_name} {r.applicant?.last_name}</div>
                  </td>
                  <td className="p-3">
                    <div>JO-{r.jobOrder?.id}</div>
                    <div className="text-xs text-gray-500">{r.jobOrder?.job_title || "—"}</div>
                  </td>
                  <td className="p-3">{r.jobOrder?.country || "—"}</td>
                  <td className="p-3">
                    <span className={r.deployment_status === "Deployed(With Concerns)" ? "text-yellow-600" : "text-green-600"}>
                      {r.deployment_status}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(r.deployment_date)}</td>
                  <td className="p-3">
                    <span className={
                      r.concern_status === "Pending" ? "text-yellow-600" :
                      r.concern_status === "Escalated" ? "text-red-600" :
                      r.concern_status === "Resolved" ? "text-green-600" : ""
                    }>
                      {r.concern_status || "—"}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(r.expected_return_date)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link href={`/monitoring/${r.id}`} className="text-blue-600 hover:underline">View</Link>
                      <Link href={`/monitoring/${r.id}/edit`} className="text-green-600 hover:underline">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No deployed applicants yet</p>
        </div>
      )}
    </div>
  )
}
   