import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

type Applicant = {
  id: number
  first_name: string | null
  last_name: string | null
  position_applied: string | null
  status: string | null
  contact_number: string | null
  email: string | null
  years_of_exp: number | null
  skills: string | null
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()

  const { id: idParam } = await params
  const id = Number(idParam)

  if (Number.isNaN(id)) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">Invalid applicant ID</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    )
  }

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">Error: {error.message}</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">Applicant not found.</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    )
  }

  const a = data as Applicant

  const { data: files } = await supabase
    .from("applicant_files")
    .select("id, file_name")
    .eq("applicant_id", id)

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">View Applicant</h1>

        <Link href="/applicants" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3">
        <p><b>Applicant ID:</b> APP-{new Date().getFullYear()}-{a.id}</p>
        <p><b>Name:</b> {a.first_name} {a.last_name}</p>
        <p><b>Position:</b> {a.position_applied}</p>
        <p><b>Status:</b> {a.status}</p>
        <p><b>Contact:</b> {a.contact_number}</p>
        <p><b>Email:</b> {a.email}</p>
        <p><b>Years of Experience:</b> {a.years_of_exp ?? 0}</p>
        <p><b>Skills:</b> {a.skills || "—"}</p>

        <p className="pt-2"><b>Files:</b></p>
        {files?.length ? (
          <ul className="list-disc pl-6 space-y-1">
            {files.map((f) => (
              <li key={f.id}>{f.file_name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No files</p>
        )}
      </div>
    </div>
  )
}
