"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  await supabase.from("applicants").insert({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    position_applied: formData.get("position_applied") as string,
    status: (formData.get("status") as string) || "For Processing",
    contact_number: (formData.get("contact_number") as string) || null,
    email: (formData.get("email") as string) || null,
    years_of_exp: Number(formData.get("years_of_exp")) || 0,
    skills: (formData.get("skills") as string) || null,
  })
  revalidatePath("/applicants")
  redirect("/applicants")
}

export async function updateApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/applicants")
  await supabase.from("applicants").update({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    position_applied: formData.get("position_applied") as string,
    status: formData.get("status") as string,
    contact_number: (formData.get("contact_number") as string) || null,
    email: (formData.get("email") as string) || null,
    years_of_exp: Number(formData.get("years_of_exp")) || 0,
    skills: (formData.get("skills") as string) || null,
  }).eq("id", id)
  revalidatePath("/applicants")
  revalidatePath(`/applicants/${id}`)
  redirect("/applicants")
}
