import { createSupabaseServer } from "@/lib/supabase/server"
import { updateMonitoring } from "../../actions"
import { BackButton } from "@/components/BackButton"

const formatValue = (x: unknown): string => (x != null && x !== "" ? String(x) : "")
const formatDateForInput = (date: string | null) => (date ? date.split("T")[0] : "")

export default async function EditMonitoringPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const monitoringId = Number(id)

  if (Number.isNaN(monitoringId)) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Invalid ID</p>
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

  const inputFieldStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelStyles = "block text-sm font-medium text-gray-700"
  const sectionHeaderStyles = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridLayoutStyles = "grid grid-cols-12 gap-4"

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
            <div>
              <h2 className={sectionHeaderStyles}>Deployment Details</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Deployment Status</label>
                  <select name="deployment_status" defaultValue={monitoring.deployment_status || "Deployed"} className={inputFieldStyles}>
                <option value="Deployed">Deployed</option>
                <option value="Deployed(With Concerns)">Deployed(With Concerns)</option>
              </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Employer Name</label>
                  <input name="employer_name" defaultValue={formatValue(monitoring.employer_name)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Contract Duration</label>
                  <input name="contract_duration" defaultValue={formatValue(monitoring.contract_duration)} className={inputFieldStyles} placeholder="Ex: 2 years" />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Salary Amount</label>
                  <input name="salary_amount" defaultValue={formatValue(monitoring.salary_amount)} className={inputFieldStyles} placeholder="Ex: 1500 SAR" />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Date of Departure</label>
                  <input type="date" name="date_of_departure" defaultValue={formatDateForInput(monitoring.date_of_departure)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Date of Arrival</label>
                  <input type="date" name="date_of_arrival" defaultValue={formatDateForInput(monitoring.date_of_arrival)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Welfare Officer Assigned</label>
                  <input name="welfare_officer" defaultValue={formatValue(monitoring.welfare_officer)} className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Concerns</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Type of Concern</label>
                  <select name="concern_type" defaultValue={formatValue(monitoring.concern_type)} className={inputFieldStyles}>
                    <option value="">None</option>
                    <option value="Salary Issue">Salary Issue</option>
                    <option value="Abuse">Abuse</option>
                    <option value="Health">Health</option>
                    <option value="Homesick">Homesick</option>
                    <option value="Contract Issue">Contract Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Date Reported</label>
                  <input type="date" name="concern_date_reported" defaultValue={formatDateForInput(monitoring.concern_date_reported)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Status of Concern</label>
                  <select name="concern_status" defaultValue={formatValue(monitoring.concern_status)} className={inputFieldStyles}>
                    <option value="">None</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </div>
                <div className="col-span-12">
                  <label className={labelStyles}>Action Taken</label>
                  <textarea name="action_taken" defaultValue={formatValue(monitoring.action_taken)} className={inputFieldStyles} rows={3} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Return Information</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Expected Return Date</label>
                  <input type="date" name="expected_return_date" defaultValue={formatDateForInput(monitoring.expected_return_date)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Actual Return Date</label>
                  <input type="date" name="actual_return_date" defaultValue={formatDateForInput(monitoring.actual_return_date)} className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Reason for Return</label>
                  <select name="reason_for_return" defaultValue={formatValue(monitoring.reason_for_return)} className={inputFieldStyles}>
                    <option value="">Not yet returned</option>
                    <option value="Contract Finished">Contract Finished</option>
                    <option value="Early Termination">Early Termination</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Health Reasons">Health Reasons</option>
                    <option value="Family Emergency">Family Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Will Extend Contract?</label>
                  <select name="will_extend_contract" defaultValue={formatValue(monitoring.will_extend_contract)} className={inputFieldStyles}>
                    <option value="">Not decided</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Maybe">Maybe</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
