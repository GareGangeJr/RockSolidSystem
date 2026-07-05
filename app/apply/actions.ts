"use server"

import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { buildApplicantInsertPayload } from "@/lib/applicant-insert"
import { createPlacement } from "@/lib/applicant-workflow"
import { ONLINE_APPLICANT_TYPE } from "@/lib/status-options"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitOnlineApplication(formData: FormData) {
  let payload
  try {
    payload = buildApplicantInsertPayload(formData, {
      status: "New Applicant",
      date_applied: new Date().toISOString().slice(0, 10),
      applicant_type: ONLINE_APPLICANT_TYPE,
    })
  } catch (error) {
    console.error("Invalid online application:", error)
    redirect("/apply/applicants?error=invalid")
  }

  const jobOrderId = Number(formData.get("job_order_id"))
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

  if (jobOrderId) {
    const { data: jobOrder } = await supabase
      .from("job_orders")
      .select("id, status")
      .eq("id", jobOrderId)
      .maybeSingle()

    if (!jobOrder || jobOrder.status === "Closed") {
      redirect("/apply/applicants?success=submitted&warning=job_closed")
    }

    const placementResult = await createPlacement(supabase, inserted.id, jobOrderId)
    if (placementResult.error) {
      redirect(
        `/apply/applicants?success=submitted&warning=placement&message=${encodeURIComponent(placementResult.error.message)}`
      )
    }
  }

  revalidatePath("/applicants")
  revalidatePath("/job-orders")
  redirect("/apply/applicants?success=submitted")
}
