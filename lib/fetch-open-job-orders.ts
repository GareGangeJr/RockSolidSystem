import type { SupabaseClient } from "@supabase/supabase-js"
import type { OpenJobOrderOption } from "@/components/applicants/job-order-select-field"

type JobOrderRow = {
  id: number
  job_title: string | null
  company: string | null
  country: string | null
}

function toJobOrderOption(order: JobOrderRow): OpenJobOrderOption {
  return {
    id: order.id,
    job_title: order.job_title ?? null,
    company: order.company ?? null,
    country: order.country ?? null,
  }
}

export async function fetchOpenJobOrdersForApplicantForm(
  supabase: SupabaseClient,
  applicantId?: number
): Promise<{ openJobOrders: OpenJobOrderOption[]; defaultJobOrderId?: number }> {
  const { data: orders } = await supabase
    .from("job_orders")
    .select("id, job_title, company, country")
    .eq("status", "Open")
    .is("archived_at", null)
    .order("created_at", { ascending: false })

  const openJobOrders = (orders ?? []).map(toJobOrderOption)
  let defaultJobOrderId: number | undefined

  if (applicantId) {
    const { data: placement } = await supabase
      .from("placements")
      .select("job_order_id")
      .eq("applicant_id", applicantId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle()

    defaultJobOrderId = placement?.job_order_id ?? undefined

    if (defaultJobOrderId && !openJobOrders.some((job) => job.id === defaultJobOrderId)) {
      const { data: currentJob } = await supabase
        .from("job_orders")
        .select("id, job_title, company, country")
        .eq("id", defaultJobOrderId)
        .maybeSingle()

      if (currentJob) {
        openJobOrders.unshift(toJobOrderOption(currentJob))
      }
    }
  }

  return { openJobOrders, defaultJobOrderId }
}
