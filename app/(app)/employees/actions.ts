"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { generateEmployeePassword } from "@/lib/generate-employee-password"
import { requireAdmin } from "@/lib/require-role"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const INACTIVE_EMPLOYMENT_STATUSES = new Set(["Resigned", "Terminated"])

async function syncEmployeeLoginAccess(employeeId: number, employmentStatus: string) {
  const admin = createSupabaseAdmin()
  const supabase = await createSupabaseServer()

  const { data: emp } = await supabase
    .from("employees")
    .select("auth_user_id")
    .eq("id", employeeId)
    .maybeSingle()

  if (!emp?.auth_user_id) return {}

  const { error } = await admin.auth.admin.updateUserById(emp.auth_user_id, {
    ban_duration: INACTIVE_EMPLOYMENT_STATUSES.has(employmentStatus) ? "876000h" : "none",
  })

  if (error) return { error: { message: error.message } }
  return {}
}

export async function checkEmployeeLoginAllowed() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { allowed: true as const }

  const { data: emp } = await supabase
    .from("employees")
    .select("employment_status")
    .eq("auth_user_id", user.id)
    .maybeSingle()

  if (!emp) return { allowed: true as const }

  if (INACTIVE_EMPLOYMENT_STATUSES.has(emp.employment_status ?? "")) {
    return {
      allowed: false as const,
      message: "This login has been disabled because the employee is no longer active.",
    }
  }

  return { allowed: true as const }
}

export async function addEmployee(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServer()

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

  const { error: insertError } = await supabase.from("employees").insert({
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
    console.error("Failed to add employee:", insertError)
    return { error: insertError.message }
  }

  revalidatePath("/employees")
  redirect("/employees?success=added")
}

export async function updateEmployee(formData: FormData) {
  await requireAdmin()
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

  const employmentStatus = (formData.get("employment_status") as string) || "Active"
  const loginSync = await syncEmployeeLoginAccess(id, employmentStatus)
  if (loginSync.error) {
    console.error("Failed to sync employee login access:", loginSync.error.message)
  }

  revalidatePath("/employees")
  revalidatePath(`/employees/${id}`)
  redirect("/employees?success=updated")
}

export async function updateEmployeeStatus(employeeId: number, newStatus: string) {
  await requireAdmin()
  const supabase = await createSupabaseServer()
  const { error } = await supabase
    .from("employees")
    .update({ employment_status: newStatus })
    .eq("id", employeeId)
  if (error) return { error }
  const loginSync = await syncEmployeeLoginAccess(employeeId, newStatus)
  if (loginSync.error) return { error: loginSync.error }
  revalidatePath("/employees")
  revalidatePath(`/employees/${employeeId}`)
  return {}
}

export async function createEmployeeLogin(employeeId: number) {
  await requireAdmin()
  const admin = createSupabaseAdmin()
  const supabase = await createSupabaseServer()

  const { data: emp, error: empError } = await supabase
    .from("employees")
    .select("id, email, auth_user_id, date_of_birth, employee_number")
    .eq("id", employeeId)
    .single()

  if (empError || !emp) return { error: { message: "Employee not found" } }
  if (!emp.email?.trim()) return { error: { message: "Employee has no email" } }
  if (emp.auth_user_id) return { error: { message: "Employee already has login" } }

  const password = generateEmployeePassword({
    date_of_birth: emp.date_of_birth,
    employee_number: emp.employee_number,
  })

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: emp.email.trim(),
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) return { error: authError || { message: "Failed to create user" } }

  await supabase.from("employees").update({ auth_user_id: authData.user.id }).eq("id", employeeId)
  revalidatePath("/employees")
  return { email: emp.email.trim(), password }
}

export async function disableEmployeeLogin(employeeId: number) {
  await requireAdmin()
  const admin = createSupabaseAdmin()
  const supabase = await createSupabaseServer()

  const { data: emp, error: empError } = await supabase
    .from("employees")
    .select("auth_user_id")
    .eq("id", employeeId)
    .single()

  if (empError || !emp) return { error: { message: "Employee not found" } }
  if (!emp.auth_user_id) return { error: { message: "Employee has no login" } }

  const { error } = await admin.auth.admin.updateUserById(emp.auth_user_id, {
    ban_duration: "876000h",
  })
  if (error) return { error: { message: error.message } }

  revalidatePath("/employees")
  return {}
}
