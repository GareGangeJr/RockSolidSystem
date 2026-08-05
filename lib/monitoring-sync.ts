import type { SupabaseClient } from "@supabase/supabase-js"
import { DEPLOYED_STATUSES } from "@/lib/applicant-workflow"

export async function syncApplicantDeploymentStatus(
  supabase: SupabaseClient,
  applicantId: number,
  deploymentStatus: string
) {
  if (!DEPLOYED_STATUSES.has(deploymentStatus)) return

  await supabase.from("applicants").update({ status: deploymentStatus }).eq("id", applicantId)
}

function formatDateForInput(value: unknown): string {
  if (value == null || String(value).trim() === "") return ""
  return String(value).slice(0, 10)
}

export { formatDateForInput as formatMonitoringDateForInput }
