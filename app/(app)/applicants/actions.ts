"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { buildApplicantInsertPayload } from "@/lib/applicant-insert"
import { applyApplicantStatusChange, DEPLOYED_STATUSES } from "@/lib/applicant-workflow"
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
    console.error("Invalid position fields:", error)
    redirect("/applicants/add")
  }

  const { data: inserted, error: insertError } = await supabase
    .from("applicants")
    .insert(payload)
    .select("id")
    .single()

  if (insertError || !inserted) {
    console.error("Error inserting applicant:", insertError)
    revalidatePath("/applicants")
    redirect("/applicants")
  }

  const initialStatus = (payload.status as string) || "New Applicant"
  if (DEPLOYED_STATUSES.has(initialStatus)) {
    const statusResult = await applyApplicantStatusChange(supabase, inserted.id, initialStatus, "New Applicant")
    if (statusResult.error) {
      redirect(`/applicants/${inserted.id}/edit?error=status&message=${encodeURIComponent(statusResult.error.message)}`)
    }
    revalidatePath("/monitoring")
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

  const result = await applyApplicantStatusChange(supabase, applicantId, newStatus, current?.status)
  if (!result.error) {
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
    console.error("Invalid position fields:", error)
    redirect(`/applicants/${id}/edit`)
  }

  const { data: current } = await supabase.from("applicants").select("status").eq("id", id).maybeSingle()
  const previousStatus = current?.status ?? null
  const newStatus = (payload.status as string) || "New Applicant"

  if (newStatus !== previousStatus) {
    const statusResult = await applyApplicantStatusChange(supabase, id, newStatus, previousStatus)
    if (statusResult.error) {
      redirect(`/applicants/${id}/edit?error=status&message=${encodeURIComponent(statusResult.error.message)}`)
    }
    revalidatePath("/monitoring")
  }

  const { error: updateError } = await supabase.from("applicants").update(payload).eq("id", id)
  if (updateError) {
    console.error("Error updating applicant:", updateError)
    redirect(`/applicants/${id}/edit`)
  }

  revalidatePath("/applicants")
  revalidatePath(`/applicants/${id}`)
  redirect("/applicants?success=updated")
}
