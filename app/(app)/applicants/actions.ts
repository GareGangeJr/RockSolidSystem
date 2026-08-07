"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { buildApplicantInsertPayload } from "@/lib/applicant-insert"
import { applyApplicantStatusChange, isManualDeployAttempt } from "@/lib/applicant-workflow"
import { logActivity } from "@/lib/activity-log"
import { requireUser } from "@/lib/require-role"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addApplicant(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()

  let payload
  try {
    payload = buildApplicantInsertPayload(formData)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save applicant."
    redirect(`/applicants/add?error=save&message=${encodeURIComponent(message)}`)
  }

  const { data: inserted, error: insertError } = await supabase
    .from("applicants")
    .insert(payload)
    .select("id")
    .single()

  if (insertError || !inserted) {
    console.error("Error inserting applicant:", insertError)
    revalidatePath("/applicants")
    redirect(
      `/applicants/add?error=save&message=${encodeURIComponent(insertError?.message ?? "Could not save applicant.")}`
    )
  }

  await logActivity({
    action: "create",
    module: "applicants",
    recordId: inserted.id,
  })

  // Job order selection only pre-fills position/country — matching is done on the match page.
  const initialStatus = (payload.status as string) || "New Applicant"
  if (isManualDeployAttempt(initialStatus, "New Applicant")) {
    redirect(
      `/applicants/${inserted.id}/edit?error=status&message=${encodeURIComponent("Deploy applicants from the job order match page.")}`
    )
  }

  revalidatePath("/applicants")
  redirect("/applicants?success=added")
}

export async function updateApplicantStatus(applicantId: number, newStatus: string) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const { data: current } = await supabase
    .from("applicants")
    .select("status")
    .eq("id", applicantId)
    .maybeSingle()

  if (current?.status === newStatus) {
    return { error: null }
  }

  if (isManualDeployAttempt(newStatus, current?.status)) {
    return { error: { message: "Deploy applicants from the job order match page." } }
  }

  const result = await applyApplicantStatusChange(supabase, applicantId, newStatus, current?.status)
  if (!result.error) {
    await logActivity({
      action: "status_change",
      module: "applicants",
      recordId: applicantId,
      ...(newStatus !== "New Applicant" ? { details: { status: newStatus } } : {}),
    })
    revalidatePath("/applicants")
    revalidatePath("/monitoring")
  }
  return result
}

export async function updateApplicant(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/applicants")

  let payload
  try {
    payload = buildApplicantInsertPayload(formData)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save applicant."
    redirect(`/applicants/${id}/edit?error=save&message=${encodeURIComponent(message)}`)
  }

  const { data: current } = await supabase.from("applicants").select("status").eq("id", id).maybeSingle()
  const previousStatus = current?.status ?? null
  const newStatus = (payload.status as string) || "New Applicant"

  if (isManualDeployAttempt(newStatus, previousStatus)) {
    redirect(
      `/applicants/${id}/edit?error=status&message=${encodeURIComponent("Deploy applicants from the job order match page.")}`
    )
  }

  if (newStatus !== previousStatus) {
    const statusResult = await applyApplicantStatusChange(supabase, id, newStatus, previousStatus)
    if (statusResult.error) {
      redirect(`/applicants/${id}/edit?error=status&message=${encodeURIComponent(statusResult.error.message)}`)
    }
    revalidatePath("/monitoring")
  }

  const { error: updateError } = await supabase.from("applicants").update(payload).eq("id", id)
  if (updateError) {
    redirect(
      `/applicants/${id}/edit?error=save&message=${encodeURIComponent(updateError.message || "Could not save applicant.")}`
    )
  }

  await logActivity({
    action: "update",
    module: "applicants",
    recordId: id,
  })

  // Job order selection only pre-fills position/country — matching is done on the match page.
  revalidatePath("/applicants")
  revalidatePath(`/applicants/${id}`)
  redirect("/applicants?success=updated")
}
