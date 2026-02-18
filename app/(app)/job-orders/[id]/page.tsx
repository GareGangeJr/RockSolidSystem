import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

type JobOrder = {
  id: number
  job_title: string | null
  company: string | null
  slots: number | null
  status: string | null
  years_exp_required: number | null
  skills_required: string | null
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const n = Number(id)

  if (Number.isNaN(n)) {
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid ID</p>
        <Link href="/job-orders" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    )
  }

  const { data, error } = await supabase
    .from("job_orders")
    .select("*")
    .eq("id", n)
    .maybeSingle()

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Not found</p>
        <Link href="/job-orders" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    )
  }

  const o = data as JobOrder

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">View Job Order</h1>
        <Link href="/job-orders" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3">
        <p><b>ID:</b> JO-{o.id}</p>
        <p><b>Job Title:</b> {o.job_title}</p>
        <p><b>Company:</b> {o.company}</p>
        <p><b>Slots:</b> {o.slots}</p>
        <p><b>Years Exp Required:</b> {o.years_exp_required ?? 0}</p>
        <p><b>Skills Required:</b> {o.skills_required || "—"}</p>
        <p><b>Status:</b> {o.status}</p>
      </div>
    </div>
  )
}
