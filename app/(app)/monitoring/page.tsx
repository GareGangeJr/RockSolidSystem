import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function MonitoringPage() {
  const supabase = await createSupabaseServer()

  // Get all monitoring records
  const { data: monitoringRecords, error: monitoringError } = await supabase
    .from("monitoring")
    .select("*")
    .order("deployment_date", { ascending: false })

  if (monitoringError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Monitoring</h1>
        <p className="text-red-500">Error: {monitoringError.message}</p>
      </div>
    )
  }

  // Get applicants and job orders separately
  const applicantIds = monitoringRecords?.map((r: any) => r.applicant_id) || []
  const jobOrderIds = monitoringRecords?.map((r: any) => r.job_order_id) || []

  const { data: applicants } = await supabase
    .from("applicants")
    .select("id, first_name, last_name, contact_number")
    .in("id", applicantIds.length > 0 ? applicantIds : [0])

  const { data: jobOrders } = await supabase
    .from("job_orders")
    .select("id, job_title, company, country")
    .in("id", jobOrderIds.length > 0 ? jobOrderIds : [0])

  // Combine data
  const records = monitoringRecords?.map((m: any) => {
    const applicant = applicants?.find((a: any) => a.id === m.applicant_id)
    const jobOrder = jobOrders?.find((j: any) => j.id === m.job_order_id)
    return {
      ...m,
      applicant,
      jobOrder
    }
  }) || []

  const withConcerns = records.filter((r: any) => r.deployment_status === "Deployed(With Concerns)")
  const deployed = records.filter((r: any) => r.deployment_status === "Deployed")

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoring</h1>

      {/* With Concerns */}
      {withConcerns.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-red-600 mb-3">
            ⚠️ Deployed with Concerns ({withConcerns.length})
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm">Applicant</th>
                  <th className="p-3 text-left text-sm">Job Order</th>
                  <th className="p-3 text-left text-sm">Company</th>
                  <th className="p-3 text-left text-sm">Deployed</th>
                  <th className="p-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withConcerns.map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">
                      <Link href={`/applicants/${r.applicant?.id}`} className="text-blue-600 hover:underline">
                        {r.applicant?.first_name} {r.applicant?.last_name}
                      </Link>
                      <div className="text-xs text-gray-500">{r.applicant?.contact_number}</div>
                    </td>
                    <td className="p-3">
                      <Link href={`/job-orders/${r.jobOrder?.id}`} className="text-blue-600 hover:underline">
                        JO-{r.jobOrder?.id}
                      </Link>
                      <div className="text-xs text-gray-600">{r.jobOrder?.job_title}</div>
                    </td>
                    <td className="p-3">
                      <div>{r.jobOrder?.company}</div>
                      <div className="text-xs text-gray-500">{r.jobOrder?.country}</div>
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(r.deployment_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Link href={`/monitoring/${r.id}`} className="text-sm text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Successfully Deployed */}
      <div>
        <h2 className="text-lg font-semibold text-green-600 mb-3">
          ✓ Successfully Deployed ({deployed.length})
        </h2>
        {deployed.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm">Applicant</th>
                  <th className="p-3 text-left text-sm">Job Order</th>
                  <th className="p-3 text-left text-sm">Company</th>
                  <th className="p-3 text-left text-sm">Deployed</th>
                  <th className="p-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deployed.map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">
                      <Link href={`/applicants/${r.applicant?.id}`} className="text-blue-600 hover:underline">
                        {r.applicant?.first_name} {r.applicant?.last_name}
                      </Link>
                      <div className="text-xs text-gray-500">{r.applicant?.contact_number}</div>
                    </td>
                    <td className="p-3">
                      <Link href={`/job-orders/${r.jobOrder?.id}`} className="text-blue-600 hover:underline">
                        JO-{r.jobOrder?.id}
                      </Link>
                      <div className="text-xs text-gray-600">{r.jobOrder?.job_title}</div>
                    </td>
                    <td className="p-3">
                      <div>{r.jobOrder?.company}</div>
                      <div className="text-xs text-gray-500">{r.jobOrder?.country}</div>
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(r.deployment_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Link href={`/monitoring/${r.id}`} className="text-sm text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No deployed applicants yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Change an applicant's status to "Deployed" to see them here
            </p>
          </div>
        )}
      </div>

      {/* Debug info */}
      {records.length === 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
          <p>Debug: No monitoring records found</p>
          <p>Check Supabase Table Editor → monitoring table</p>
        </div>
      )}
    </div>
  )
}
   