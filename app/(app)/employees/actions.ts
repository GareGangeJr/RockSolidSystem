"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addEmployee(formData: FormData) {
  const supabase = await createSupabaseServer()

  // Auto-generate employee number (EMP-YYYY-###)
  const year = new Date().getFullYear()
  const { data: existingEmployees, error: queryError } = await supabase
    .from("employees")
    .select("employee_number")
    .like("employee_number", `EMP-${year}-%`)
    .order("employee_number", { ascending: false })
    .limit(1)

  if (queryError) {
    console.error("Query error:", queryError)
  }

  let nextNumber = 1
  if (existingEmployees && existingEmployees.length > 0) {
    const lastNumber = existingEmployees[0].employee_number
    const match = lastNumber?.match(/EMP-\d{4}-(\d+)/)
    if (match) nextNumber = parseInt(match[1]) + 1
  }
  const employeeNumber = `EMP-${year}-${String(nextNumber).padStart(3, '0')}`

  const { data, error: insertError } = await supabase.from("employees").insert({
    employee_number: employeeNumber,
    position: formData.get("position") as string,
    department: formData.get("department") as string,
    date_hired: formData.get("date_hired") || null,
    employment_status: (formData.get("employment_status") as string) || "Active",
    employment_type: formData.get("employment_type") as string,
    
    last_name: formData.get("last_name") as string,
    first_name: formData.get("first_name") as string,
    middle_name: formData.get("middle_name") as string || null,
    date_of_birth: formData.get("date_of_birth") || null,
    gender: formData.get("gender") as string,
    civil_status: formData.get("civil_status") as string,
    contact_number: formData.get("contact_number") as string,
    email: formData.get("email") as string,
    current_address: formData.get("current_address") as string,
    
    sss_number: formData.get("sss_number") as string || null,
    philhealth_number: formData.get("philhealth_number") as string || null,
    pagibig_number: formData.get("pagibig_number") as string || null,
    tin_number: formData.get("tin_number") as string || null,
    
    basic_salary: formData.get("basic_salary") as string || null,
    allowances: formData.get("allowances") as string || null,
    
    emergency_contact_name: formData.get("emergency_contact_name") as string || null,
    emergency_contact_relationship: formData.get("emergency_contact_relationship") as string || null,
    emergency_contact_number: formData.get("emergency_contact_number") as string || null,
    
    contract_start_date: formData.get("contract_start_date") || null,
    contract_end_date: formData.get("contract_end_date") || null,
    notes: formData.get("notes") as string || null,
  }).select()

  if (insertError) {
    console.error("❌ Failed to add employee:", insertError)
    return { error: insertError.message }
  }

  console.log("✅ Employee added successfully:", data)
  revalidatePath("/employees")
  redirect("/employees")
}

export async function updateEmployee(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/employees")

  await supabase.from("employees").update({
    position: formData.get("position") as string,
    department: formData.get("department") as string,
    date_hired: formData.get("date_hired") || null,
    employment_status: (formData.get("employment_status") as string) || "Active",
    employment_type: formData.get("employment_type") as string,
    
    last_name: formData.get("last_name") as string,
    first_name: formData.get("first_name") as string,
    middle_name: formData.get("middle_name") as string || null,
    date_of_birth: formData.get("date_of_birth") || null,
    gender: formData.get("gender") as string,
    civil_status: formData.get("civil_status") as string,
    contact_number: formData.get("contact_number") as string,
    email: formData.get("email") as string,
    current_address: formData.get("current_address") as string,
    
    sss_number: formData.get("sss_number") as string || null,
    philhealth_number: formData.get("philhealth_number") as string || null,
    pagibig_number: formData.get("pagibig_number") as string || null,
    tin_number: formData.get("tin_number") as string || null,
    
    basic_salary: formData.get("basic_salary") as string || null,
    allowances: formData.get("allowances") as string || null,
    
    emergency_contact_name: formData.get("emergency_contact_name") as string || null,
    emergency_contact_relationship: formData.get("emergency_contact_relationship") as string || null,
    emergency_contact_number: formData.get("emergency_contact_number") as string || null,
    
    contract_start_date: formData.get("contract_start_date") || null,
    contract_end_date: formData.get("contract_end_date") || null,
    notes: formData.get("notes") as string || null,
  }).eq("id", id)

  revalidatePath("/employees")
  revalidatePath(`/employees/${id}`)
  redirect("/employees")
}

export async function deleteEmployee(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/employees")

  await supabase.from("employees").delete().eq("id", id)

  revalidatePath("/employees")
  redirect("/employees")
}
