"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addJobOrder(formData: FormData) {
  const supabase = await createSupabaseServer()

  await supabase.from("job_orders").insert({
    job_title: formData.get("job_title") as string,
    company: formData.get("company") as string,
    slots: Number(formData.get("slots")) || 1,
    years_exp_required: Number(formData.get("years_exp_required")) || 0,
    skills_required: (formData.get("skills_required") as string) || null,
    status: (formData.get("status") as string) || "Open",
  })

  revalidatePath("/job-orders")
  redirect("/job-orders")
}

export async function deleteJobOrder(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (id) await supabase.from("job_orders").delete().eq("id", id)
  revalidatePath("/job-orders")
  redirect("/job-orders")
}

export async function matchToJob(formData: FormData) {
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))
  if (applicantId && jobOrderId) {
    await supabase.from("placements").insert({ applicant_id: applicantId, job_order_id: jobOrderId })
  }
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match`)
}

export async function deleteMatch(formData: FormData) {
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))
  if (applicantId && jobOrderId) {
    await supabase.from("placements").delete().eq("applicant_id", applicantId).eq("job_order_id", jobOrderId)
  }
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match`)
}
