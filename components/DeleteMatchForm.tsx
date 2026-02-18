import { deleteMatch } from "@/app/(app)/job-orders/actions"

export default function DeleteMatchForm({
  applicantId,
  jobOrderId,
}: {
  applicantId: number
  jobOrderId: number
}) {
  return (
    <form action={deleteMatch} className="inline">
      <input type="hidden" name="applicant_id" value={applicantId} />
      <input type="hidden" name="job_order_id" value={jobOrderId} />
      <button
        type="submit"
        className="px-3 py-1 text-sm rounded border bg-red-100 hover:bg-red-200 text-red-800"
      >
        Delete Match
      </button>
    </form>
  )
}
