"use server"

import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { buildApplicantInsertPayload } from "@/lib/applicant-insert"
import { getOnlineApplicantType } from "@/lib/status-options"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitOnlineApplication(formData: FormData) {
  let payload
  try {
    payload = buildApplicantInsertPayload(formData, {
      status: "New Applicant",
      date_applied: new Date().toISOString().slice(0, 10),
      applicant_type: getOnlineApplicantType(String(formData.get("position_applied") ?? "")),
    })
  } catch (error) {
    console.error("Invalid online application:", error)
    const message = error instanceof Error ? error.message : ""
    if (message.toLowerCase().includes("18")) {
      redirect(`/apply/applicants?error=underage&message=${encodeURIComponent(message)}`)
    }
    redirect("/apply/applicants?error=invalid")
  }

  const supabase = createSupabaseAdmin()

  const { data: inserted, error: insertError } = await supabase
    .from("applicants")
    .insert(payload)
    .select("id")
    .single()

  if (insertError || !inserted) {
    console.error("Error submitting online application:", insertError)
    redirect("/apply/applicants?error=submit")
  }

  // Job order selection only pre-fills position/country — matching is done by staff.
  revalidatePath("/applicants")
  revalidatePath("/job-orders")
  revalidatePath("/apply/applicants")
  revalidatePath("/apply/job-orders")
  redirect("/apply/applicants?success=submitted")
}
