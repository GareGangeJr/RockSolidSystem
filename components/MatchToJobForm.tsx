import { matchToJob } from "@/app/(app)/job-orders/actions"

export default function MatchToJobForm({
  applicantId,
  jobOrderId,
}: {
  applicantId: number
  jobOrderId: number
}) {
  return (
    <form action={matchToJob} className="inline">
      <input type="hidden" name="applicant_id" value={applicantId} />
      <input type="hidden" name="job_order_id" value={jobOrderId} />
      <button
        type="submit"
        className="px-3 py-1 text-sm rounded border bg-green-100 hover:bg-green-200 text-green-800"
      >
        Match to Job
      </button>
    </form>
  )
}
