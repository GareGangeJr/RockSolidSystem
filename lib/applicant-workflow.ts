import type { SupabaseClient } from "@supabase/supabase-js"

export const DEPLOYED_STATUSES = new Set(["Deployed", "Deployed(With Concerns)"])

const EARLY_APPLICANT_STATUSES = new Set(["New Applicant"])

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

  if (!applicant?.status || !EARLY_APPLICANT_STATUSES.has(applicant.status)) return

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

async function nextEmployeeNumber(supabase: SupabaseClient): Promise<string> {
  const year = new Date().getFullYear()
  const { data: existingEmployees } = await supabase
    .from("employees")
    .select("employee_number")
    .like("employee_number", `EMP-${year}-%`)
    .order("employee_number", { ascending: false })
    .limit(1)

  let nextNumber = 1
  if (existingEmployees && existingEmployees.length > 0) {
    const lastNumber = existingEmployees[0].employee_number
    const match = lastNumber?.match(/EMP-\d{4}-(\d+)/)
    if (match) nextNumber = parseInt(match[1], 10) + 1
  }

  return `EMP-${year}-${String(nextNumber).padStart(3, "0")}`
}

export function applicantEmployeeMarker(applicantId: number): string {
  return `[applicant:${applicantId}]`
}

export async function ensureEmployeeFromApplicant(
  supabase: SupabaseClient,
  applicantId: number,
  jobOrderId: number
): Promise<void> {
  const marker = applicantEmployeeMarker(applicantId)

  const { data: existing } = await supabase
    .from("employees")
    .select("id")
    .ilike("notes", `%${marker}%`)
    .maybeSingle()

  if (existing) return

  const { data: applicant } = await supabase.from("applicants").select("*").eq("id", applicantId).maybeSingle()
  if (!applicant) return

  const { data: job } = await supabase
    .from("job_orders")
    .select("country, company, job_title")
    .eq("id", jobOrderId)
    .maybeSingle()

  const employeeNumber = await nextEmployeeNumber(supabase)
  const today = new Date().toISOString().slice(0, 10)

  const { error } = await supabase.from("employees").insert({
    employee_number: employeeNumber,
    position: applicant.position_applied || job?.job_title || "Domestic Helper",
    department: job?.country ? `Deployment - ${job.country}` : "Overseas Deployment",
    date_hired: today,
    employment_status: "Active",
    employment_type: "Contract",
    last_name: applicant.last_name,
    first_name: applicant.first_name,
    middle_name: applicant.middle_name,
    date_of_birth: applicant.date_of_birth,
    gender: applicant.gender || "Female",
    civil_status: applicant.civil_status || "Single",
    contact_number: applicant.contact_number || applicant.active_cellphone,
    email: applicant.email,
    current_address: applicant.current_address || applicant.provincial_address,
    emergency_contact_name: applicant.emergency_contact_name,
    emergency_contact_relationship: applicant.emergency_contact_relationship,
    emergency_contact_number: applicant.emergency_contact_number,
    notes: `${marker} Auto-created when applicant was deployed.${job?.company ? ` Job: ${job.company}.` : ""}`,
  })

  if (error) {
    console.error("Error creating employee from applicant:", error)
  }
}

export async function applyApplicantStatusChange(
  supabase: SupabaseClient,
  applicantId: number,
  newStatus: string,
  previousStatus?: string | null
): Promise<WorkflowResult> {
  const isDeploying = DEPLOYED_STATUSES.has(newStatus)
  const wasDeployed = Boolean(previousStatus && DEPLOYED_STATUSES.has(previousStatus))

  let jobOrderId: number | null = null

  if (isDeploying) {
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
      const { error: insertError } = await supabase.from("monitoring").insert({
        applicant_id: applicantId,
        job_order_id: jobOrderId,
        deployment_status: newStatus,
        deployment_date: new Date().toISOString().split("T")[0],
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

    await ensureEmployeeFromApplicant(supabase, applicantId, jobOrderId)
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
