"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import {
  buildMonitoringEntrySyncPayload,
  hasOpenConcern,
  normalizeConcernEntriesFromRecord,
  parseConcernEntriesJson,
  parseHistoryEntriesJson,
  resolveDeploymentStatus,
  validateConcernEntries,
} from "@/lib/monitoring-entries"
import { syncApplicantDeploymentStatus } from "@/lib/monitoring-sync"
import { logActivity } from "@/lib/activity-log"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/require-role"
import { redirect } from "next/navigation"

function revalidateMonitoringPaths(id: number, applicantId?: number) {
  revalidatePath("/monitoring")
  revalidatePath(`/monitoring/${id}`)
  revalidatePath(`/monitoring/${id}/edit`)
  revalidatePath(`/monitoring/${id}/concerns`)
  if (applicantId) {
    revalidatePath("/applicants")
    revalidatePath(`/applicants/${applicantId}`)
  }
}

export async function updateMonitoring(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))

  if (!id) redirect("/monitoring")

  const { data: current } = await supabase
    .from("monitoring")
    .select("applicant_id, deployment_status, concern_entries, concern_type, concern_date_reported, concern_status, action_taken")
    .eq("id", id)
    .maybeSingle()

  if (!current) redirect("/monitoring")

  const concerns = normalizeConcernEntriesFromRecord(current as Record<string, unknown>)
  const requestedStatus = (formData.get("deployment_status") as string) || "Deployed"

  if (requestedStatus === "Deployed" && hasOpenConcern(concerns)) {
    redirect(
      `/monitoring/${id}/edit?error=status&message=${encodeURIComponent(
        "Cannot set status to Deployed while open concerns exist. Resolve concerns first or use Concerns & History."
      )}`
    )
  }

  const deploymentStatus = resolveDeploymentStatus(concerns, requestedStatus)
  const deploymentDateRaw = (formData.get("deployment_date") as string)?.trim()
  const deployment_date = deploymentDateRaw ? deploymentDateRaw.slice(0, 10) : null

  await supabase
    .from("monitoring")
    .update({
      deployment_status: deploymentStatus,
      deployment_date,
      date_of_departure: deployment_date,
      employer_name: (formData.get("employer_name") as string) || null,
      contract_duration: (formData.get("contract_duration") as string) || null,
      salary_amount: (formData.get("salary_amount") as string) || null,
      welfare_officer: (formData.get("welfare_officer") as string) || null,
      last_status_update: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  await syncApplicantDeploymentStatus(supabase, current.applicant_id, deploymentStatus)
  await logActivity({ action: "update", module: "monitoring", recordId: id })

  revalidateMonitoringPaths(id, current.applicant_id)
  redirect("/monitoring?success=updated")
}

export async function updateMonitoringConcerns(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))

  if (!id) redirect("/monitoring")

  const { data: current } = await supabase
    .from("monitoring")
    .select("deployment_status, deployment_date, applicant_id")
    .eq("id", id)
    .maybeSingle()

  if (!current) redirect("/monitoring")

  const concerns = parseConcernEntriesJson(formData.get("concern_entries") as string | null)
  const history = parseHistoryEntriesJson(formData.get("history_entries") as string | null)

  const validationError = validateConcernEntries(concerns)
  if (validationError) {
    redirect(`/monitoring/${id}/concerns?error=save&message=${encodeURIComponent(validationError)}`)
  }

  const deploymentDate =
    (formData.get("deployment_date") as string)?.trim().slice(0, 10) ||
    (current.deployment_date ? String(current.deployment_date).slice(0, 10) : null)

  const payload = buildMonitoringEntrySyncPayload(concerns, history, {
    currentDeploymentStatus: current.deployment_status,
    deploymentDate,
  })

  const { error } = await supabase.from("monitoring").update(payload).eq("id", id)

  if (error) {
    redirect(
      `/monitoring/${id}/concerns?error=save&message=${encodeURIComponent(
        error.message.includes("concern_entries") || error.message.includes("history_entries")
          ? "Database columns missing. Run supabase/monitoring_entries.sql in Supabase SQL Editor."
          : error.message
      )}`
    )
  }

  await syncApplicantDeploymentStatus(supabase, current.applicant_id, payload.deployment_status)
  await logActivity({ action: "update", module: "monitoring", recordId: id })

  revalidateMonitoringPaths(id, current.applicant_id)
  redirect("/monitoring?success=updated")
}
