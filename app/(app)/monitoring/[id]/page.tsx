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
        <Link href="/monitoring" className="text-blue-600 hover:underline">← Back</Link>
      </div>
    )
  }

  const { data: monitoring, error } = await supabase
    .from("monitoring")
    .select("*")
    .eq("id", monitoringId)
    .maybeSingle()

  if (error || !monitoring) {
    return (
      <div className="p-6">
        <p className="text-red-500">Record not found</p>
        <Link href="/monitoring" className="text-blue-600 hover:underline">← Back</Link>
      </div>
    )
  }

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

  const formatDate = (date: string | null) => {
    if (!date) return "—"
    return new Date(date).toLocaleDateString()
  }

  const v = (value: any) => value || "—"

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monitoring Details</h1>
        <Link href="/monitoring" className="text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Applicant & Job Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Applicant & Job Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Applicant Name</p><p className="font-medium">{applicant?.first_name} {applicant?.last_name}</p></div>
            <div><p className="text-gray-500">Contact</p><p className="font-medium">{v(applicant?.contact_number)}</p></div>
            <div><p className="text-gray-500">Job Order ID</p><p className="font-medium">JO-{jobOrder?.id}</p></div>
            <div><p className="text-gray-500">Job Title</p><p className="font-medium">{v(jobOrder?.job_title)}</p></div>
            <div><p className="text-gray-500">Company</p><p className="font-medium">{v(jobOrder?.company)}</p></div>
            <div><p className="text-gray-500">Country</p><p className="font-medium">{v(jobOrder?.country)}</p></div>
            <div><p className="text-gray-500">Passport Number</p><p className="font-medium">{v(applicant?.passport_number)}</p></div>
          </div>
        </div>

        {/* Deployment Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Deployment Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Deployment Status</p>
              <p className={`font-medium ${monitoring.deployment_status === "Deployed(With Concerns)" ? "text-yellow-600" : "text-green-600"}`}>
                {monitoring.deployment_status}
              </p>
            </div>
            <div><p className="text-gray-500">Employer Name</p><p className="font-medium">{v(monitoring.employer_name)}</p></div>
            <div><p className="text-gray-500">Contract Duration</p><p className="font-medium">{v(monitoring.contract_duration)}</p></div>
            <div><p className="text-gray-500">Salary Amount</p><p className="font-medium">{v(monitoring.salary_amount)}</p></div>
            <div><p className="text-gray-500">Date of Departure</p><p className="font-medium">{formatDate(monitoring.date_of_departure)}</p></div>
            <div><p className="text-gray-500">Date of Arrival</p><p className="font-medium">{formatDate(monitoring.date_of_arrival)}</p></div>
            <div><p className="text-gray-500">Welfare Officer Assigned</p><p className="font-medium">{v(monitoring.welfare_officer)}</p></div>
            <div><p className="text-gray-500">Last Status Update</p><p className="font-medium">{formatDate(monitoring.last_status_update)}</p></div>
          </div>
        </div>

        {/* Concerns */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Concerns</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Type of Concern</p><p className="font-medium">{v(monitoring.concern_type)}</p></div>
            <div><p className="text-gray-500">Date Reported</p><p className="font-medium">{formatDate(monitoring.concern_date_reported)}</p></div>
            <div className="col-span-2"><p className="text-gray-500">Action Taken</p><p className="font-medium">{v(monitoring.action_taken)}</p></div>
            <div>
              <p className="text-gray-500">Status of Concern</p>
              <p className={`font-medium ${
                monitoring.concern_status === "Pending" ? "text-yellow-600" : 
                monitoring.concern_status === "Resolved" ? "text-green-600" : 
                monitoring.concern_status === "Escalated" ? "text-red-600" : ""
              }`}>
                {v(monitoring.concern_status)}
              </p>
            </div>
          </div>
        </div>

        {/* Return Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Return Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Expected Return Date</p><p className="font-medium">{formatDate(monitoring.expected_return_date)}</p></div>
            <div><p className="text-gray-500">Actual Return Date</p><p className="font-medium">{formatDate(monitoring.actual_return_date)}</p></div>
            <div><p className="text-gray-500">Reason for Return</p><p className="font-medium">{v(monitoring.reason_for_return)}</p></div>
            <div><p className="text-gray-500">Will Extend Contract?</p><p className="font-medium">{v(monitoring.will_extend_contract)}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
