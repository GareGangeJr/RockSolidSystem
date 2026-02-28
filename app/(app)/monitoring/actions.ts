"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateMonitoring(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  
  if (!id) redirect("/monitoring")

  await supabase.from("monitoring").update({
    deployment_status: formData.get("deployment_status") as string,
    employer_name: formData.get("employer_name") as string || null,
    contract_duration: formData.get("contract_duration") as string || null,
    salary_amount: formData.get("salary_amount") as string || null,
    date_of_departure: formData.get("date_of_departure") || null,
    date_of_arrival: formData.get("date_of_arrival") || null,
    welfare_officer: formData.get("welfare_officer") as string || null,
    last_status_update: new Date().toISOString(),
    concern_type: formData.get("concern_type") as string || null,
    concern_date_reported: formData.get("concern_date_reported") || null,
    action_taken: formData.get("action_taken") as string || null,
    concern_status: formData.get("concern_status") as string || null,
    expected_return_date: formData.get("expected_return_date") || null,
    actual_return_date: formData.get("actual_return_date") || null,
    reason_for_return: formData.get("reason_for_return") as string || null,
    will_extend_contract: formData.get("will_extend_contract") as string || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id)

  revalidatePath("/monitoring")
  redirect("/monitoring")
}

export async function deleteMonitoring(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/monitoring")

  await supabase.from("monitoring").delete().eq("id", id)

  revalidatePath("/monitoring")
  redirect("/monitoring")
}
