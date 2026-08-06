"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import type { ArchivableTable, ArchivableFileTable } from "@/lib/archive"
import { logActivity } from "@/lib/activity-log"
import { requireAdmin, requireUser } from "@/lib/require-role"
import { revalidatePath } from "next/cache"

const REVALIDATE_PATHS: Record<ArchivableTable, string[]> = {
  applicants: ["/applicants", "/archive"],
  job_orders: ["/job-orders", "/archive", "/apply/job-orders"],
  employees: ["/employees", "/archive"],
  monitoring: ["/monitoring", "/archive"],
}

function revalidateFor(table: ArchivableTable, id: number) {
  for (const path of REVALIDATE_PATHS[table]) {
    revalidatePath(path)
  }

  if (table === "applicants") revalidatePath(`/applicants/${id}`)
  if (table === "job_orders") revalidatePath(`/job-orders/${id}`)
  if (table === "employees") revalidatePath(`/employees/${id}`)
  if (table === "monitoring") revalidatePath(`/monitoring/${id}`)
}

async function resolveArchiveRecordId(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  table: ArchivableTable,
  id: number
) {
  if (table === "employees") {
    const { data } = await supabase
      .from("employees")
      .select("employee_number")
      .eq("id", id)
      .maybeSingle()
    return data?.employee_number ?? id
  }

  return id
}

export async function archiveRecord(table: ArchivableTable, id: number) {
  if (table === "employees") await requireAdmin()
  else await requireUser()
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from(table)
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id)
    .is("archived_at", null)
    .select("id")

  if (error) {
    console.error(`Error archiving ${table} ${id}:`, error)
    return { error: { message: error.message } }
  }

  if (!data?.length) {
    return { error: { message: "Could not archive record. It may already be archived." } }
  }

  if (table === "employees") {
    const adminClient = createSupabaseAdmin()
    const { data: emp } = await adminClient
      .from("employees")
      .select("auth_user_id")
      .eq("id", id)
      .maybeSingle()
    if (emp?.auth_user_id) {
      await adminClient.auth.admin.updateUserById(emp.auth_user_id, { ban_duration: "876000h" })
    }
  }

  const recordId = await resolveArchiveRecordId(supabase, table, id)

  await logActivity({
    action: "archive",
    module: table,
    recordId,
    details: { status: "Archived", table, entityId: id },
  })

  revalidateFor(table, id)
  revalidatePath("/")
  return { error: null }
}

export async function restoreRecord(table: ArchivableTable, id: number) {
  if (table === "employees") await requireAdmin()
  else await requireUser()
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from(table)
    .update({ archived_at: null })
    .eq("id", id)
    .not("archived_at", "is", null)
    .select("id")

  if (error) {
    console.error(`Error restoring ${table} ${id}:`, error)
    return { error: { message: error.message } }
  }

  if (!data?.length) {
    return { error: { message: "Could not restore record. It may already be restored." } }
  }

  if (table === "employees") {
    const adminClient = createSupabaseAdmin()
    const { data: emp } = await adminClient
      .from("employees")
      .select("auth_user_id, employment_status")
      .eq("id", id)
      .maybeSingle()
    if (emp?.auth_user_id) {
      const inactive = emp.employment_status === "Resigned" || emp.employment_status === "Terminated"
      await adminClient.auth.admin.updateUserById(emp.auth_user_id, {
        ban_duration: inactive ? "876000h" : "none",
      })
    }
  }

  const recordId = await resolveArchiveRecordId(supabase, table, id)

  await logActivity({
    action: "restore",
    module: table,
    recordId,
    details: { status: "Restored", table, entityId: id },
  })

  revalidateFor(table, id)
  revalidatePath("/")
  return { error: null }
}

export async function archiveFileRecord(
  table: ArchivableFileTable,
  fileId: number,
  entityId: number
) {
  if (table === "employee_files") await requireAdmin()
  else await requireUser()
  const supabase = createSupabaseAdmin()

  const { data, error } = await supabase
    .from(table)
    .update({ archived_at: new Date().toISOString() })
    .eq("id", fileId)
    .is("archived_at", null)
    .select("id")

  if (error) {
    console.error(`Error archiving ${table} ${fileId}:`, error)
    return { error: { message: error.message } }
  }

  if (!data?.length) {
    return { error: { message: "Could not archive file. It may already be archived or you may not have permission." } }
  }

  const parentModule = table === "applicant_files" ? "applicants" : "employees"
  let recordId: string | number = entityId
  if (parentModule === "employees") {
    const { data: emp } = await supabase
      .from("employees")
      .select("employee_number")
      .eq("id", entityId)
      .maybeSingle()
    if (emp?.employee_number) recordId = emp.employee_number
  }

  await logActivity({
    action: "archive",
    module: parentModule,
    recordId,
    details: { status: "Archived", table, entityId },
  })

  revalidatePath("/archive")
  if (table === "applicant_files") revalidatePath(`/applicants/${entityId}/files`)
  if (table === "employee_files") revalidatePath(`/employees/${entityId}/files`)

  return { error: null }
}

export async function restoreFileRecord(
  table: ArchivableFileTable,
  fileId: number,
  entityId: number
) {
  if (table === "employee_files") await requireAdmin()
  else await requireUser()
  const supabase = createSupabaseAdmin()

  const { data, error } = await supabase
    .from(table)
    .update({ archived_at: null })
    .eq("id", fileId)
    .not("archived_at", "is", null)
    .select("id")

  if (error) {
    console.error(`Error restoring ${table} ${fileId}:`, error)
    return { error: { message: error.message } }
  }

  if (!data?.length) {
    return { error: { message: "Could not restore file." } }
  }

  const parentModule = table === "applicant_files" ? "applicants" : "employees"
  let recordId: string | number = entityId
  if (parentModule === "employees") {
    const { data: emp } = await supabase
      .from("employees")
      .select("employee_number")
      .eq("id", entityId)
      .maybeSingle()
    if (emp?.employee_number) recordId = emp.employee_number
  }

  await logActivity({
    action: "restore",
    module: parentModule,
    recordId,
    details: { status: "Restored", table, entityId },
  })

  revalidatePath("/archive")
  if (table === "applicant_files") revalidatePath(`/applicants/${entityId}/files`)
  if (table === "employee_files") revalidatePath(`/employees/${entityId}/files`)

  return { error: null }
}
