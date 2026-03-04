import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const numericId = Number(id)

  if (Number.isNaN(numericId)) return (
    <div className="p-6">
      <p className="text-red-500">Invalid ID</p>
      <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const { data, error } = await supabase.from("job_orders").select("*").eq("id", numericId).maybeSingle()

  if (error || !data) return (
    <div className="p-6">
      <p className="text-red-500">Not found</p>
      <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const jobOrder = data as any

  return (
    <div className="p-6 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">View Job Order</h1>
        <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <p><b>ID:</b> JO-{jobOrder.id}</p>
        <p><b>Company Name:</b> {jobOrder.company || "—"}</p>
        <p><b>Country:</b> {jobOrder.country || "—"}</p>
        <p><b>Job Title:</b> {jobOrder.job_title || "—"}</p>
        <p><b>Gender:</b> {jobOrder.gender || "—"}</p>
        <p><b>Number of Workers:</b> {jobOrder.no_workers || 0}</p>
        <p><b>Years Experience Required:</b> {jobOrder.years_exp_required || 0}</p>
        <p><b>Skills Required:</b> {jobOrder.skills_required || "—"}</p>
        <p><b>Basic Salary:</b> {jobOrder.salary || "—"}</p>
        <p><b>Status:</b> {jobOrder.status || "—"}</p>
      </div>
    </div>
  )
}
