import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateJobOrder } from "../../actions"

const v = (x: unknown): string => (x != null && x !== "" ? String(x) : "")

export default async function EditJobOrderPage({
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
        <p className="text-red-500">Job order not found</p>
        <Link href="/job-orders" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    )
  }

  const o = data as Record<string, unknown>

  return (
    <div className="p-6 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Edit Job Order</h1>
        <Link href="/job-orders" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <form action={updateJobOrder} className="bg-white rounded-lg shadow p-6 space-y-3">
        <input type="hidden" name="id" value={Number(o.id)} />

        <div>
          <label className="block text-sm mb-1">Company Name</label>
          <input
            name="company"
            className="w-full border rounded-md p-2"
            required
            defaultValue={v(o.company)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Job Title</label>
          <input
            name="job_title"
            className="w-full border rounded-md p-2"
            defaultValue={v(o.job_title)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Slots</label>
          <input
            name="slots"
            type="number"
            className="w-full border rounded-md p-2"
            defaultValue={o.slots != null ? String(o.slots) : "1"}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Years Experience Required</label>
          <input
            name="years_exp_required"
            type="number"
            min={0}
            className="w-full border rounded-md p-2"
            defaultValue={o.years_exp_required != null ? String(o.years_exp_required) : "0"}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Skills Required (comma-separated)</label>
          <input
            name="skills_required"
            className="w-full border rounded-md p-2"
            placeholder="e.g. Cooking, Child Care, Driving"
            defaultValue={v(o.skills_required)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            name="status"
            className="w-full border rounded-md p-2"
            defaultValue={v(o.status) || "Open"}
          >
            <option>Open</option>
            <option>Filled</option>
            <option>Closed</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Update
        </button>
      </form>
    </div>
  )
}

