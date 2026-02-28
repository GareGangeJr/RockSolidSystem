import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Eye, UserPlus } from "lucide-react"
import DeleteJobOrderForm from "@/components/DeleteJobOrderForm"

type JobOrder = {
  id: number
  created_at: string
  company: string | null
  country: string | null
  job_title: string | null
  no_workers: number | null
  status: string | null
}

export default async function JobOrdersPage() {
  const supabase = await createSupabaseServer()

  const { data: orders, error } = await supabase
    .from("job_orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error loading job orders</div>
  }

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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Job Title</th>
              <th className="p-3 text-left">Workers</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o: JobOrder) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">JO-{o.id}</td>
                <td className="p-3">{o.company}</td>
                <td className="p-3">{o.country}</td>
                <td className="p-3">{o.job_title}</td>
                <td className="p-3">{o.no_workers}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/job-orders/${o.id}`}
                      className="p-1 rounded-md text-black hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/job-orders/${o.id}/match`}
                      className="p-1 rounded-md text-black hover:bg-green-100 hover:text-green-600"
                      title="Match Applicants"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Link>
                    <DeleteJobOrderForm id={o.id} />
                  </div>
                </td>
              </tr>
            ))}
            {orders?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No job orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
