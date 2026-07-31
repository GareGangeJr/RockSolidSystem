"use client"

import { deployMatchedApplicant } from "@/app/(app)/job-orders/actions"

export default function DeployMatchForm({
  applicantId,
  jobOrderId,
}: {
  applicantId: number
  jobOrderId: number
}) {
  return (
    <form
      action={deployMatchedApplicant}
      className="inline"
      onSubmit={(event) => {
        if (!confirm("Deploy this applicant?")) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="applicant_id" value={applicantId} />
      <input type="hidden" name="job_order_id" value={jobOrderId} />
      <button
        type="submit"
        className="rounded border bg-blue-100 px-3 py-1 text-sm text-blue-800 hover:bg-blue-200"
      >
        Deploy
      </button>
    </form>
  )
}
