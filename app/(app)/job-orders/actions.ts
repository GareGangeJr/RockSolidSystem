"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { createPlacement, removePlacement, applyApplicantStatusChange } from "@/lib/applicant-workflow"
import { jobOrderFromFormData } from "@/lib/job-order-fields"
import { logActivity } from "@/lib/activity-log"
import { requireUser } from "@/lib/require-role"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addJobOrder(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()

  const { data: inserted, error } = await supabase
    .from("job_orders")
    .insert(jobOrderFromFormData(formData))
    .select("id")
    .single()

  if (error || !inserted) {
    console.error("Error adding job order:", error)
    revalidatePath("/job-orders")
    redirect("/job-orders")
  }

  await logActivity({ action: "create", module: "job_orders", recordId: inserted.id })

  revalidatePath("/job-orders")
  redirect("/job-orders?success=added")
}

export async function updateJobOrderStatus(jobOrderId: number, newStatus: string) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from("job_orders").update({ status: newStatus }).eq("id", jobOrderId)
  if (error) {
    console.error("Error updating job order status:", error)
    return { error: { message: error.message } }
  }
  await logActivity({
    action: "status_change",
    module: "job_orders",
    recordId: jobOrderId,
    details: { status: newStatus },
  })
  revalidatePath("/job-orders")
  return { error: null }
}

export async function matchToJob(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))

  const result = await createPlacement(supabase, applicantId, jobOrderId)
  if (result.error) {
    redirect(
      `/job-orders/${jobOrderId}/match?error=match&message=${encodeURIComponent(result.error.message)}`
    )
  }

  await logActivity({
    action: "match",
    module: "job_orders",
    recordId: jobOrderId,
    details: { applicantId },
  })

  revalidatePath("/applicants")
  revalidatePath("/job-orders")
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match?success=matched`)
}

export async function deleteMatch(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))

  const result = await removePlacement(supabase, applicantId, jobOrderId)
  if (result.error) {
    redirect(
      `/job-orders/${jobOrderId}/match?error=match&message=${encodeURIComponent(result.error.message)}`
    )
  }

  await logActivity({
    action: "unmatch",
    module: "job_orders",
    recordId: jobOrderId,
    details: { applicantId },
  })

  revalidatePath("/applicants")
  revalidatePath("/job-orders")
  revalidatePath("/monitoring")
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match?success=unmatched`)
}

export async function deployMatchedApplicant(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))

  if (!applicantId || !jobOrderId) {
    redirect(`/job-orders/${jobOrderId}/match?error=deploy&message=${encodeURIComponent("Invalid applicant or job order.")}`)
  }

  const { data: existingMonitoring } = await supabase
    .from("monitoring")
    .select("id")
    .eq("applicant_id", applicantId)
    .eq("job_order_id", jobOrderId)
    .maybeSingle()

  if (existingMonitoring) {
    revalidatePath("/applicants")
    revalidatePath("/monitoring")
    revalidatePath(`/job-orders/${jobOrderId}/match`)
    redirect(`/job-orders/${jobOrderId}/match?success=deployed`)
  }

  const { data: applicant } = await supabase
    .from("applicants")
    .select("status")
    .eq("id", applicantId)
    .maybeSingle()

  const result = await applyApplicantStatusChange(
    supabase,
    applicantId,
    "Deployed",
    applicant?.status ?? null,
    jobOrderId
  )

  if (result.error) {
    redirect(
      `/job-orders/${jobOrderId}/match?error=deploy&message=${encodeURIComponent(result.error.message)}`
    )
  }

  await logActivity({
    action: "deploy",
    module: "applicants",
    recordId: applicantId,
    details: { status: "Deployed", jobOrderId },
  })

  revalidatePath("/applicants")
  revalidatePath("/job-orders")
  revalidatePath("/monitoring")
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match?success=deployed`)
}

export async function updateJobOrder(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()

  const id = Number(formData.get("id"))
  if (!id) redirect("/job-orders")

  const { error } = await supabase
    .from("job_orders")
    .update(jobOrderFromFormData(formData))
    .eq("id", id)

  if (error) {
    console.error("Error updating job order:", error)
    revalidatePath("/job-orders")
    redirect("/job-orders")
  }

  await logActivity({ action: "update", module: "job_orders", recordId: id })

  revalidatePath("/job-orders")
  revalidatePath(`/job-orders/${id}`)
  revalidatePath(`/job-orders/${id}/edit`)
  redirect("/job-orders?success=updated")
}
