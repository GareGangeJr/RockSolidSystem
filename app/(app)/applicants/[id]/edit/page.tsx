import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateApplicant } from "../../actions"

export default async function EditPage({
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
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", n)
    .maybeSingle()

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Applicant not found</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const a = data

  return (
    <div className="p-6 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Edit Applicant</h1>
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>

      <form action={updateApplicant} className="bg-white shadow p-4 rounded-lg space-y-3">
        <input type="hidden" name="id" value={a.id} />

        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input name="first_name" className="w-full border rounded p-2" defaultValue={a.first_name ?? ""} required />
        </div>

        <div>
          <label className="block text-sm mb-1">Last Name</label>
          <input name="last_name" className="w-full border rounded p-2" defaultValue={a.last_name ?? ""} required />
        </div>

        <div>
          <label className="block text-sm mb-1">Position Applied</label>
          <input name="position_applied" className="w-full border rounded p-2" defaultValue={a.position_applied ?? ""} required />
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select name="status" className="w-full border rounded p-2" defaultValue={a.status ?? ""}>
            <option>For Processing</option>
            <option>Deployed</option>
            <option>For Deployment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Contact Number</label>
          <input name="contact_number" className="w-full border rounded p-2" defaultValue={a.contact_number ?? ""} />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" className="w-full border rounded p-2" defaultValue={a.email ?? ""} />
        </div>

        <div>
          <label className="block text-sm mb-1">Years of Experience</label>
          <input name="years_of_exp" type="number" min={0} className="w-full border rounded p-2" defaultValue={a.years_of_exp ?? 0} />
        </div>

        <div>
          <label className="block text-sm mb-1">Skills (comma-separated)</label>
          <input name="skills" className="w-full border rounded p-2" placeholder="e.g. Cooking, Child Care, Driving" defaultValue={a.skills ?? ""} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Applicant
        </button>
      </form>
    </div>
  )
}
