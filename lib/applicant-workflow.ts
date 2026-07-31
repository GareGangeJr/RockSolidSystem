import type { SupabaseClient } from "@supabase/supabase-js"
import { MATCH_EXCLUDED_STATUSES } from "@/lib/status-options"

export const DEPLOYED_STATUSES = new Set(["Deployed", "Deployed(With Concerns)"])

export function isManualDeployAttempt(newStatus: string, previousStatus?: string | null): boolean {
  return DEPLOYED_STATUSES.has(newStatus) && !(previousStatus && DEPLOYED_STATUSES.has(previousStatus))
}

export type WorkflowResult = { error: { message: string } | null }

export async function syncJobOrderFilledStatus(
  supabase: SupabaseClient,
  jobOrderId: number
): Promise<void> {
  const { data: job } = await supabase
    .from("job_orders")
    .select("no_workers, status")
    .eq("id", jobOrderId)
    .maybeSingle()

  if (!job || job.status === "Closed") return

  const { count } = await supabase
    .from("placements")
    .select("*", { count: "exact", head: true })
    .eq("job_order_id", jobOrderId)

  const matched = count ?? 0
  const needed = Math.max(1, job.no_workers ?? 1)

  if (matched >= needed && job.status !== "Filled") {
    await supabase.from("job_orders").update({ status: "Filled" }).eq("id", jobOrderId)
  } else if (matched < needed && job.status === "Filled") {
    await supabase.from("job_orders").update({ status: "Open" }).eq("id", jobOrderId)
  }
}

export async function promoteApplicantToSelected(
  supabase: SupabaseClient,
  applicantId: number
): Promise<void> {
  const { data: applicant } = await supabase
    .from("applicants")
    .select("status")
    .eq("id", applicantId)
    .maybeSingle()

  const status = applicant?.status
  if (status === "Selected") return
  if (status && MATCH_EXCLUDED_STATUSES.has(status)) return

  await supabase.from("applicants").update({ status: "Selected" }).eq("id", applicantId)
}

export async function createPlacement(
  supabase: SupabaseClient,
  applicantId: number,
  jobOrderId: number
): Promise<WorkflowResult> {
  if (!applicantId || !jobOrderId) {
    return { error: { message: "Invalid applicant or job order." } }
  }

  const { data: existing } = await supabase
    .from("placements")
    .select("id")
    .eq("applicant_id", applicantId)
    .eq("job_order_id", jobOrderId)
    .maybeSingle()

  if (existing) {
    return { error: { message: "Applicant is already matched to this job order." } }
  }

  const { data: job } = await supabase
    .from("job_orders")
    .select("no_workers, status")
    .eq("id", jobOrderId)
    .maybeSingle()

  if (!job) {
    return { error: { message: "Job order not found." } }
  }

  if (job.status === "Closed") {
    return { error: { message: "This job order is closed." } }
  }

  const { count } = await supabase
    .from("placements")
    .select("*", { count: "exact", head: true })
    .eq("job_order_id", jobOrderId)

  const needed = Math.max(1, job.no_workers ?? 1)
  if ((count ?? 0) >= needed) {
    return { error: { message: "This job order already has enough matched applicants." } }
  }

  const { error: insertError } = await supabase.from("placements").insert({
    applicant_id: applicantId,
    job_order_id: jobOrderId,
  })

  if (insertError) {
    return { error: { message: insertError.message } }
  }

  await promoteApplicantToSelected(supabase, applicantId)
  await syncJobOrderFilledStatus(supabase, jobOrderId)

  return { error: null }
}

export async function removePlacement(
  supabase: SupabaseClient,
  applicantId: number,
  jobOrderId: number
): Promise<WorkflowResult> {
  if (!applicantId || !jobOrderId) {
    return { error: { message: "Invalid applicant or job order." } }
  }

  const { data: applicant } = await supabase
    .from("applicants")
    .select("status")
    .eq("id", applicantId)
    .maybeSingle()

  if (applicant?.status && DEPLOYED_STATUSES.has(applicant.status)) {
    return {
      error: {
        message: "Cannot remove match: applicant is already deployed. Change their status first.",
      },
    }
  }

  await supabase
    .from("monitoring")
    .delete()
    .eq("applicant_id", applicantId)
    .eq("job_order_id", jobOrderId)

  const { error: deleteError } = await supabase
    .from("placements")
    .delete()
    .eq("applicant_id", applicantId)
    .eq("job_order_id", jobOrderId)

  if (deleteError) {
    return { error: { message: deleteError.message } }
  }

  const { count } = await supabase
    .from("placements")
    .select("*", { count: "exact", head: true })
    .eq("applicant_id", applicantId)

  if ((count ?? 0) === 0 && applicant?.status === "Selected") {
    await supabase.from("applicants").update({ status: "New Applicant" }).eq("id", applicantId)
  }

  await syncJobOrderFilledStatus(supabase, jobOrderId)

  return { error: null }
}

async function monitoringDefaultsFromJobOrder(supabase: SupabaseClient, jobOrderId: number) {
  const { data: job } = await supabase
    .from("job_orders")
    .select("company, salary, contract_period")
    .eq("id", jobOrderId)
    .maybeSingle()

  if (!job) return {}

  return {
    employer_name: job.company || null,
    salary_amount: job.salary || null,
    contract_duration: job.contract_period || null,
  }
}

export async function applyApplicantStatusChange(
  supabase: SupabaseClient,
  applicantId: number,
  newStatus: string,
  previousStatus?: string | null,
  preferredJobOrderId?: number | null
): Promise<WorkflowResult> {
  const isDeploying = DEPLOYED_STATUSES.has(newStatus)
  const wasDeployed = Boolean(previousStatus && DEPLOYED_STATUSES.has(previousStatus))

  let jobOrderId: number | null = null

  if (isDeploying) {
    if (preferredJobOrderId) {
      const { data: placement } = await supabase
        .from("placements")
        .select("job_order_id")
        .eq("applicant_id", applicantId)
        .eq("job_order_id", preferredJobOrderId)
        .maybeSingle()

      if (!placement) {
        return {
          error: {
            message: "Cannot deploy: Applicant is not matched to this job order.",
          },
        }
      }

      const { data: deployedElsewhere } = await supabase
        .from("monitoring")
        .select("id")
        .eq("applicant_id", applicantId)
        .neq("job_order_id", preferredJobOrderId)
        .limit(1)

      if (deployedElsewhere && deployedElsewhere.length > 0) {
        return {
          error: {
            message: "Applicant is already deployed to another job order.",
          },
        }
      }

      jobOrderId = preferredJobOrderId
    } else {
      const { data: placement } = await supabase
        .from("placements")
        .select("job_order_id")
        .eq("applicant_id", applicantId)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!placement) {
        return {
          error: {
            message:
              "Cannot deploy: Applicant is not matched to any job order. Please match them to a job order first.",
          },
        }
      }
      jobOrderId = placement.job_order_id
    }
  }

  const { error: statusError } = await supabase
    .from("applicants")
    .update({ status: newStatus })
    .eq("id", applicantId)

  if (statusError) {
    console.error("Error updating applicant status:", statusError)
    return { error: { message: statusError.message } }
  }

  if (isDeploying && jobOrderId) {
    const { data: existing } = await supabase
      .from("monitoring")
      .select("id")
      .eq("applicant_id", applicantId)
      .eq("job_order_id", jobOrderId)
      .maybeSingle()

    if (!existing) {
      const jobDefaults = await monitoringDefaultsFromJobOrder(supabase, jobOrderId)
      const { error: insertError } = await supabase.from("monitoring").insert({
        applicant_id: applicantId,
        job_order_id: jobOrderId,
        deployment_status: newStatus,
        deployment_date: new Date().toISOString().split("T")[0],
        ...jobDefaults,
      })

      if (insertError) {
        await supabase.from("applicants").update({ status: previousStatus ?? "New Applicant" }).eq("id", applicantId)
        return { error: { message: `Error creating monitoring record: ${insertError.message}` } }
      }
    } else {
      const { error: updateError } = await supabase
        .from("monitoring")
        .update({
          deployment_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (updateError) {
        await supabase.from("applicants").update({ status: previousStatus ?? "New Applicant" }).eq("id", applicantId)
        return { error: { message: `Error updating monitoring record: ${updateError.message}` } }
      }
    }
  } else if (wasDeployed && !isDeploying) {
    const { error: monitoringError } = await supabase
      .from("monitoring")
      .update({
        deployment_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("applicant_id", applicantId)

    if (monitoringError) {
      console.error("Error syncing monitoring status:", monitoringError)
    }
  }

  return { error: null }
}
