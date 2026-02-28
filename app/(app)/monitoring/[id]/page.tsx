import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function MonitoringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const monitoringId = Number(id)

  if (Number.isNaN(monitoringId)) {
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid monitoring ID</p>
        <Link href="/monitoring" className="text-blue-600 hover:underline">
          ← Back to Monitoring
        </Link>
      </div>
    )
  }

  // Get monitoring record
  const { data: monitoring, error } = await supabase
    .from("monitoring")
    .select("*")
    .eq("id", monitoringId)
    .maybeSingle()

  if (error || !monitoring) {
    return (
      <div className="p-6">
        <p className="text-red-500">Monitoring record not found</p>
        <Link href="/monitoring" className="text-blue-600 hover:underline">
          ← Back to Monitoring
        </Link>
      </div>
    )
  }

  // Get applicant details
  const { data: applicant } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", monitoring.applicant_id)
    .maybeSingle()

  // Get job order details
  const { data: jobOrder } = await supabase
    .from("job_orders")
    .select("*")
    .eq("id", monitoring.job_order_id)
    .maybeSingle()

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monitoring Details</h1>
        <Link
          href="/monitoring"
          className="text-blue-600 hover:underline"
        >
          ← Back to Monitoring
        </Link>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Applicant Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Applicant Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">
                {applicant?.first_name} {applicant?.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium">{applicant?.contact_number || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{applicant?.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p className="font-medium">{applicant?.position_applied || "—"}</p>
            </div>
          </div>
        </div>

        {/* Job Order Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Job Order Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Job Order ID</p>
              <p className="font-medium">JO-{jobOrder?.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="font-medium">{jobOrder?.job_title || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{jobOrder?.company || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-medium">{jobOrder?.country || "—"}</p>
            </div>
          </div>
        </div>

        {/* Deployment Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Deployment Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${
                monitoring.deployment_status === "Deployed(With Concerns)"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}>
                {monitoring.deployment_status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Deployment Date</p>
              <p className="font-medium">
                {new Date(monitoring.deployment_date).toLocaleDateString()}
              </p>
            </div>
            {monitoring.last_check_date && (
              <div>
                <p className="text-sm text-gray-500">Last Check Date</p>
                <p className="font-medium">
                  {new Date(monitoring.last_check_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {monitoring.concerns && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Concerns</p>
                <p className="font-medium text-red-600">{monitoring.concerns}</p>
              </div>
            )}
            {monitoring.monitoring_notes && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium">{monitoring.monitoring_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Add more details section here */}
        <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
          <p>More details can be added here...</p>
        </div>
      </div>
    </div>
  )
}
