import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateJobOrder } from "../../actions"

const v = (x: unknown) => (x != null ? String(x) : "")

export default async function EditJobOrderPage({
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
      <p className="text-red-500">Job order not found</p>
      <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  return (
    <div className="p-6 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Edit Job Order</h1>
        <Link href="/job-orders" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <form action={updateJobOrder} className="bg-white rounded-lg shadow p-6 space-y-4">
        <input type="hidden" name="id" value={data.id} />

        <div>
          <label className="block text-sm mb-1">Company Name</label>
          <input name="company" defaultValue={v(data.company)} className="w-full border rounded-md p-2" required />
        </div>

        <div>
          <label className="block text-sm mb-1">Country</label>
          <input name="country" defaultValue={v(data.country)} className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Job Title</label>
          <input name="job_title" defaultValue={v(data.job_title)} className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Gender</label>
          <select name="gender" defaultValue={v(data.gender)} className="w-full border rounded-md p-2">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Any">Any</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Number of Workers</label>
          <input
            name="no_workers"
            type="number"
            defaultValue={Number(data.no_workers) || 1}
            min={1}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Years Experience Required</label>
          <input
            name="years_exp_required"
            type="number"
            defaultValue={Number(data.years_exp_required) || 0}
            min={0}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Skills Required</label>
          <input
            name="skills_required"
            defaultValue={v(data.skills_required)}
            className="w-full border rounded-md p-2"
            placeholder="e.g. Cooking, Cleaning"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Basic Salary</label>
          <input name="salary" defaultValue={v(data.salary)} className="w-full border rounded-md p-2" placeholder="e.g. 1500 SAR" />
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select name="status" defaultValue={v(data.status) || "Open"} className="w-full border rounded-md p-2">
            <option>Open</option>
            <option>Filled</option>
            <option>Closed</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
          Save Changes
        </button>
      </form>
    </div>
  )
}
