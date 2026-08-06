import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { PublicJobOrderTable } from "@/components/apply/PublicJobOrderTable"

export default async function PublicJobOrdersPage() {
  const supabase = createSupabaseAdmin()

  const { data: orders, error } = await supabase
    .from("job_orders")
    .select("id, company, country, job_title, no_workers")
    .eq("status", "Open")
    .is("archived_at", null)
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="text-red-500">Error loading job orders.</div>
  }

  const list = (orders ?? []).map((order) => ({
    id: order.id,
    company: order.company ?? null,
    country: order.country ?? null,
    job_title: order.job_title ?? null,
    no_workers: order.no_workers ?? null,
  }))

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Available Jobs</h1>
        <p className="mt-1 text-sm text-gray-600">Open positions you can apply for.</p>
      </div>

      <PublicJobOrderTable jobOrders={list} />
    </div>
  )
}
