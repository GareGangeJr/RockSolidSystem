"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addMonitoringNote(monitoringId: number, note: string) {
  const supabase = await createSupabaseServer()
  
  const { error } = await supabase
    .from("monitoring")
    .update({ 
      monitoring_notes: note,
      updated_at: new Date().toISOString()
    })
    .eq("id", monitoringId)
  
  revalidatePath("/monitoring")
  return { error }
}

export async function updateConcerns(monitoringId: number, concerns: string) {
  const supabase = await createSupabaseServer()
  
  const { error } = await supabase
    .from("monitoring")
    .update({ 
      concerns: concerns,
      updated_at: new Date().toISOString()
    })
    .eq("id", monitoringId)
  
  revalidatePath("/monitoring")
  return { error }
}

export async function recordCheckIn(monitoringId: number, notes: string) {
  const supabase = await createSupabaseServer()
  
  const { error } = await supabase
    .from("monitoring")
    .update({ 
      last_check_date: new Date().toISOString().split('T')[0],
      monitoring_notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq("id", monitoringId)
  
  revalidatePath("/monitoring")
  return { error }
}

export async function updateDeploymentStatus(monitoringId: number, newStatus: string) {
  const supabase = await createSupabaseServer()
  
  const { error } = await supabase
    .from("monitoring")
    .update({ 
      deployment_status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", monitoringId)
  
  revalidatePath("/monitoring")
  return { error }
}
