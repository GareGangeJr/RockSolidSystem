import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import JobOrdersListWithFilters from "@/components/JobOrdersListWithFilters"

export default async function JobOrdersPage() {
  const supabase = await createSupabaseServer()

  const { data: orders, error } = await supabase
    .from("job_orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error loading job orders</div>
  }

  const list = (orders ?? []).map((o) => ({
    id: o.id,
    created_at: o.created_at,
    company: o.company ?? null,
    country: o.country ?? null,
    job_title: o.job_title ?? null,
    no_workers: o.no_workers ?? null,
    status: o.status ?? null,
  }))

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Job Orders</h1>
        <Link
          href="/job-orders/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Job Order
        </Link>
      </div>
      <JobOrdersListWithFilters jobOrders={list} />
    </div>
  )
}
