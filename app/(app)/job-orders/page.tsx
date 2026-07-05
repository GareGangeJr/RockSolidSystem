import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { JobOrderTable } from "@/components/job-orders/JobOrderTable"

export default async function JobOrdersPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const { success } = await searchParams
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
      {success === "added" && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-800">
          Job order added successfully.
        </div>
      )}
      {success === "updated" && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-800">
          Job order updated successfully.
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Job Orders</h1>
        <Link
          href="/job-orders/add"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Job Order
        </Link>
      </div>
      <JobOrderTable jobOrders={list} />
    </div>
  )
}
