"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { createPlacement, removePlacement } from "@/lib/applicant-workflow"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const getStr = (formData: FormData, key: string) => (formData.get(key) as string) ?? ""
const getStrOrNull = (formData: FormData, key: string) => {
  const v = formData.get(key) as string | null
  return v != null && v.trim() !== "" ? v : null
}

export async function addJobOrder(formData: FormData) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase.from("job_orders").insert({
    company: getStr(formData, "company"),
    country: getStrOrNull(formData, "country"),
    job_title: getStr(formData, "job_title"),
    gender: getStrOrNull(formData, "gender") ?? "Any",
    no_workers: Math.max(1, Number(formData.get("no_workers")) || 1),
    years_exp_required: Math.max(0, Number(formData.get("years_exp_required")) || 0),
    skills_required: getStrOrNull(formData, "skills_required"),
    salary: getStr(formData, "salary"),
    status: getStr(formData, "status") || "Open",
  })

  if (error) {
    console.error("Error adding job order:", error)
    revalidatePath("/job-orders")
    redirect("/job-orders")
  }

  revalidatePath("/job-orders")
  redirect("/job-orders?success=added")
}

export async function updateJobOrderStatus(jobOrderId: number, newStatus: string) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from("job_orders").update({ status: newStatus }).eq("id", jobOrderId)
  if (error) {
    console.error("Error updating job order status:", error)
    return { error: { message: error.message } }
  }
  revalidatePath("/job-orders")
  return { error: null }
}

export async function matchToJob(formData: FormData) {
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))

  const result = await createPlacement(supabase, applicantId, jobOrderId)
  if (result.error) {
    redirect(
      `/job-orders/${jobOrderId}/match?error=match&message=${encodeURIComponent(result.error.message)}`
    )
  }

  revalidatePath("/applicants")
  revalidatePath("/job-orders")
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match?success=matched`)
}

export async function deleteMatch(formData: FormData) {
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))

  const result = await removePlacement(supabase, applicantId, jobOrderId)
  if (result.error) {
    redirect(
      `/job-orders/${jobOrderId}/match?error=match&message=${encodeURIComponent(result.error.message)}`
    )
  }

  revalidatePath("/applicants")
  revalidatePath("/job-orders")
  revalidatePath("/monitoring")
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match?success=unmatched`)
}

export async function updateJobOrder(formData: FormData) {
  const supabase = await createSupabaseServer()

  const id = Number(formData.get("id"))
  if (!id) redirect("/job-orders")

  const { error } = await supabase
    .from("job_orders")
    .update({
      company: getStr(formData, "company"),
      country: getStrOrNull(formData, "country"),
      job_title: getStr(formData, "job_title"),
      gender: getStrOrNull(formData, "gender") ?? "Any",
      no_workers: Math.max(1, Number(formData.get("no_workers")) || 1),
      years_exp_required: Math.max(0, Number(formData.get("years_exp_required")) || 0),
      skills_required: getStrOrNull(formData, "skills_required"),
      salary: getStr(formData, "salary"),
      status: getStr(formData, "status") || "Open",
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating job order:", error)
    revalidatePath("/job-orders")
    redirect("/job-orders")
  }

  revalidatePath("/job-orders")
  revalidatePath(`/job-orders/${id}`)
  revalidatePath(`/job-orders/${id}/edit`)
  redirect("/job-orders?success=updated")
}
