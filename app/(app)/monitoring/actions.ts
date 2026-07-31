"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import {
  buildMonitoringEntrySyncPayload,
  parseConcernEntriesJson,
  parseHistoryEntriesJson,
} from "@/lib/monitoring-entries"
import { logActivity } from "@/lib/activity-log"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/require-role"
import { redirect } from "next/navigation"

function revalidateMonitoringPaths(id: number) {
  revalidatePath("/monitoring")
  revalidatePath(`/monitoring/${id}`)
  revalidatePath(`/monitoring/${id}/edit`)
  revalidatePath(`/monitoring/${id}/concerns`)
}

export async function updateMonitoring(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))

  if (!id) redirect("/monitoring")

  await supabase
    .from("monitoring")
    .update({
      deployment_status: formData.get("deployment_status") as string,
      employer_name: (formData.get("employer_name") as string) || null,
      contract_duration: (formData.get("contract_duration") as string) || null,
      salary_amount: (formData.get("salary_amount") as string) || null,
      welfare_officer: (formData.get("welfare_officer") as string) || null,
      last_status_update: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  await logActivity({ action: "update", module: "monitoring", recordId: id })

  revalidateMonitoringPaths(id)
  redirect("/monitoring")
}

export async function updateMonitoringConcerns(formData: FormData) {
  await requireUser()
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))

  if (!id) redirect("/monitoring")

  const { data: current } = await supabase
    .from("monitoring")
    .select("deployment_status")
    .eq("id", id)
    .maybeSingle()

  const concerns = parseConcernEntriesJson(formData.get("concern_entries") as string | null)
  const history = parseHistoryEntriesJson(formData.get("history_entries") as string | null)

  const payload = buildMonitoringEntrySyncPayload(concerns, history, current?.deployment_status)

  const { error } = await supabase.from("monitoring").update(payload).eq("id", id)

  if (error) {
    redirect(
      `/monitoring/${id}/concerns?error=save&message=${encodeURIComponent(
        error.message.includes("concern_entries") || error.message.includes("history_entries")
          ? "Database columns missing. Run supabase/monitoring_entries.sql in Supabase SQL Editor."
          : error.message
      )}`
    )
  }

  await logActivity({ action: "update", module: "monitoring", recordId: id })

  revalidateMonitoringPaths(id)
  redirect("/monitoring?success=updated")
}
