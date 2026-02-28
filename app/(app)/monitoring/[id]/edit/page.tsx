import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateMonitoring } from "../../actions"

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
      <p className="text-red-500">Invalid ID</p>
      <Link href="/monitoring" className="text-blue-600 hover:underline">← Back</Link>
    </div>
  )

  const { data: monitoring } = await supabase.from("monitoring").select("*").eq("id", monitoringId).maybeSingle()

  if (!monitoring) return (
    <div className="p-6">
      <p className="text-red-500">Record not found</p>
      <Link href="/monitoring" className="text-blue-600 hover:underline">← Back</Link>
    </div>
  )

  const formatDateForInput = (date: string | null) => date ? date.split("T")[0] : ""

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Monitoring</h1>
        <Link href="/monitoring" className="text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      <form action={updateMonitoring} className="max-w-2xl space-y-6">
        <input type="hidden" name="id" value={monitoringId} />

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold border-b pb-2">Deployment Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Deployment Status</label>
              <select name="deployment_status" defaultValue={monitoring.deployment_status} className="w-full border rounded-md p-2">
                <option value="Deployed">Deployed</option>
                <option value="Deployed(With Concerns)">Deployed(With Concerns)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Employer Name</label>
              <input name="employer_name" defaultValue={monitoring.employer_name || ""} className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Contract Duration</label>
              <input name="contract_duration" defaultValue={monitoring.contract_duration || ""} className="w-full border rounded-md p-2" placeholder="e.g. 2 years" />
            </div>
            <div>
              <label className="block text-sm mb-1">Salary Amount</label>
              <input name="salary_amount" defaultValue={monitoring.salary_amount || ""} className="w-full border rounded-md p-2" placeholder="e.g. 1500 SAR" />
            </div>
            <div>
              <label className="block text-sm mb-1">Date of Departure</label>
              <input type="date" name="date_of_departure" defaultValue={formatDateForInput(monitoring.date_of_departure)} className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Date of Arrival</label>
              <input type="date" name="date_of_arrival" defaultValue={formatDateForInput(monitoring.date_of_arrival)} className="w-full border rounded-md p-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1">Welfare Officer Assigned</label>
              <input name="welfare_officer" defaultValue={monitoring.welfare_officer || ""} className="w-full border rounded-md p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold border-b pb-2">Concerns</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Type of Concern</label>
              <select name="concern_type" defaultValue={monitoring.concern_type || ""} className="w-full border rounded-md p-2">
                <option value="">None</option>
                <option value="Salary Issue">Salary Issue</option>
                <option value="Abuse">Abuse</option>
                <option value="Health">Health</option>
                <option value="Homesick">Homesick</option>
                <option value="Contract Issue">Contract Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Date Reported</label>
              <input type="date" name="concern_date_reported" defaultValue={formatDateForInput(monitoring.concern_date_reported)} className="w-full border rounded-md p-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1">Action Taken</label>
              <textarea name="action_taken" defaultValue={monitoring.action_taken || ""} className="w-full border rounded-md p-2" rows={2}></textarea>
            </div>
            <div>
              <label className="block text-sm mb-1">Status of Concern</label>
              <select name="concern_status" defaultValue={monitoring.concern_status || ""} className="w-full border rounded-md p-2">
                <option value="">None</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold border-b pb-2">Return Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Expected Return Date</label>
              <input type="date" name="expected_return_date" defaultValue={formatDateForInput(monitoring.expected_return_date)} className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Actual Return Date</label>
              <input type="date" name="actual_return_date" defaultValue={formatDateForInput(monitoring.actual_return_date)} className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Reason for Return</label>
              <select name="reason_for_return" defaultValue={monitoring.reason_for_return || ""} className="w-full border rounded-md p-2">
                <option value="">Not yet returned</option>
                <option value="Contract Finished">Contract Finished</option>
                <option value="Early Termination">Early Termination</option>
                <option value="Vacation">Vacation</option>
                <option value="Health Reasons">Health Reasons</option>
                <option value="Family Emergency">Family Emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Will Extend Contract?</label>
              <select name="will_extend_contract" defaultValue={monitoring.will_extend_contract || ""} className="w-full border rounded-md p-2">
                <option value="">Not decided</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md w-full">
          Save Changes
        </button>
      </form>
    </div>
  )
}
