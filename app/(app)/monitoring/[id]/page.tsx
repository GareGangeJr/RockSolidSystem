import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"

const formatValue = (x: unknown) => (x != null && x !== "" ? String(x) : "--")
const formatDate = (x: unknown) => (x != null && String(x).length >= 10 ? String(x).slice(0, 10) : "--")

export default async function MonitoringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const monitoringId = Number(id)

  if (Number.isNaN(monitoringId)) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Invalid monitoring ID</p>
      <BackButton href="/monitoring" />
    </div>
  )

  const { data: monitoring, error } = await supabase.from("monitoring").select("*").eq("id", monitoringId).maybeSingle()

  if (error || !monitoring) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Record not found</p>
      <BackButton href="/monitoring" />
    </div>
  )

  const { data: applicant } = await supabase.from("applicants").select("*").eq("id", monitoring.applicant_id).maybeSingle()
  const { data: jobOrder } = await supabase.from("job_orders").select("*").eq("id", monitoring.job_order_id).maybeSingle()

  const labelStyles = "block text-xs font-medium text-gray-500"
  const valueStyles = "mt-0.5 text-sm text-gray-900"
  const sectionHeaderStyles = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridLayoutStyles = "grid grid-cols-12 gap-4"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">View Monitoring</h1>
          <BackButton href="/monitoring" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <div>
              <h2 className={sectionHeaderStyles}>Applicant & Job Information</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Applicant Name</span>
                  <p className={valueStyles}>{applicant ? `${formatValue(applicant.first_name)} ${formatValue(applicant.last_name)}` : "--"}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Contact</span>
                  <p className={valueStyles}>{formatValue(applicant?.contact_number)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Passport Number</span>
                  <p className={valueStyles}>{formatValue(applicant?.passport_number)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Job Order ID</span>
                  <p className={valueStyles}>{jobOrder ? `JO-${formatValue(jobOrder.id)}` : "--"}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Job Title</span>
                  <p className={valueStyles}>{formatValue(jobOrder?.job_title)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Company</span>
                  <p className={valueStyles}>{formatValue(jobOrder?.company)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Country</span>
                  <p className={valueStyles}>{formatValue(jobOrder?.country)}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Deployment Details</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Deployment Status</span>
                  <p className={valueStyles}>{formatValue(monitoring.deployment_status)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Employer Name</span>
                  <p className={valueStyles}>{formatValue(monitoring.employer_name)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Contract Duration</span>
                  <p className={valueStyles}>{formatValue(monitoring.contract_duration)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Salary Amount</span>
                  <p className={valueStyles}>{formatValue(monitoring.salary_amount)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Date of Departure</span>
                  <p className={valueStyles}>{formatDate(monitoring.date_of_departure)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Date of Arrival</span>
                  <p className={valueStyles}>{formatDate(monitoring.date_of_arrival)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Welfare Officer Assigned</span>
                  <p className={valueStyles}>{formatValue(monitoring.welfare_officer)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Last Status Update</span>
                  <p className={valueStyles}>{formatDate(monitoring.last_status_update)}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Concerns</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Type of Concern</span>
                  <p className={valueStyles}>{formatValue(monitoring.concern_type)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Date Reported</span>
                  <p className={valueStyles}>{formatDate(monitoring.concern_date_reported)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Status of Concern</span>
                  <p className={valueStyles}>{formatValue(monitoring.concern_status)}</p>
                </div>
                <div className="col-span-12">
                  <span className={labelStyles}>Action Taken</span>
                  <p className={valueStyles}>{formatValue(monitoring.action_taken)}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Return Information</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Expected Return Date</span>
                  <p className={valueStyles}>{formatDate(monitoring.expected_return_date)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Actual Return Date</span>
                  <p className={valueStyles}>{formatDate(monitoring.actual_return_date)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Reason for Return</span>
                  <p className={valueStyles}>{formatValue(monitoring.reason_for_return)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Will Extend Contract?</span>
                  <p className={valueStyles}>{formatValue(monitoring.will_extend_contract)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
