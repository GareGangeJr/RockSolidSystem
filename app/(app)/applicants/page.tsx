import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import ApplicantsListWithFilters from "@/components/ApplicantsListWithFilters"

export default async function ApplicantsPage() {
  const supabase = await createSupabaseServer()

  const { data: applicants, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error loading applicants</div>
  }

  const list = (applicants ?? []).map((a) => ({
    id: a.id,
    created_at: a.created_at,
    first_name: a.first_name ?? null,
    middle_name: a.middle_name ?? null,
    last_name: a.last_name ?? null,
    position_applied: a.position_applied ?? null,
    applicant_type: a.applicant_type ?? null,
    status: a.status ?? null,
    contact_number: a.contact_number ?? null,
    email: a.email ?? null,
    date_applied: a.date_applied ?? null,
  }))

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Applicants</h1>
        <Link
          href="/applicants/add"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Applicant
        </Link>
      </div>
      <ApplicantsListWithFilters applicants={list} />
    </div>
  )
}
