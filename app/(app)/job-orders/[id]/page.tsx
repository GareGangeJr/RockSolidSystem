import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const n = Number(id)

  if (Number.isNaN(n)) return (
    <div className="p-6">
      <p className="text-red-500">Invalid ID</p>
      <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const { data, error } = await supabase.from("job_orders").select("*").eq("id", n).maybeSingle()

  if (error || !data) return (
    <div className="p-6">
      <p className="text-red-500">Not found</p>
      <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const o = data as any

  return (
    <div className="p-6 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">View Job Order</h1>
        <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <p><b>ID:</b> JO-{o.id}</p>
        <p><b>Company Name:</b> {o.company || "—"}</p>
        <p><b>Country:</b> {o.country || "—"}</p>
        <p><b>Job Title:</b> {o.job_title || "—"}</p>
        <p><b>Gender:</b> {o.gender || "—"}</p>
        <p><b>Number of Workers:</b> {o.no_workers || 0}</p>
        <p><b>Years Experience Required:</b> {o.years_exp_required || 0}</p>
        <p><b>Skills Required:</b> {o.skills_required || "—"}</p>
        <p><b>Basic Salary:</b> {o.salary || "—"}</p>
        <p><b>Status:</b> {o.status || "—"}</p>
      </div>
    </div>
  )
}
