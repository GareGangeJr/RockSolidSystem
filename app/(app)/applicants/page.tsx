import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Pencil, Eye } from "lucide-react"

type Applicant = {
  id: number
  created_at: string
  first_name: string | null
  last_name: string | null
  position_applied: string | null
  status: string | null
  contact_number: string | null
  email: string | null
}

export default async function ApplicantsPage() {
  const supabase = await createSupabaseServer()

  const { data: applicants, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error loading applicants</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Applicants</h1>

        <Link
          href="/applicants/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Applicant
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
            <th className="p-3 text-left">Applicant ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applicants?.map((app: Applicant) => (
              <tr key={app.id} className="border-t">
                <td className="p-3">{`APP-${new Date().getFullYear()}-${app.id}`}</td>
                <td className="p-3">{app.first_name} {app.last_name} </td>
                <td className="p-3">{app.position_applied}</td>
                <td className="p-3">{app.status}</td>
                <td className="p-3">{app.contact_number}</td>
                <td className="p-3">{app.email}</td>
                <td className="p-3">

                <div className="flex items-center gap-3">
                <Link
                   href={`/applicants/${app.id}`}
                   className="p-1 rounded-md text-black hover:bg-blue-100 hover:text-blue-600 transition"
                >
                   <Eye className="w-4 h-4" />
                </Link>
                  <Link
                    href={`/applicants/${app.id}/edit`}
                    className="text-black hover:text-yellow-500 transition duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  </div>
                </td>
              </tr>
            ))}

            {applicants?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
