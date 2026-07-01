import { createSupabaseServer } from "@/lib/supabase/server"
import { EditApplicantForm } from "@/components/applicants/EditApplicantForm"
import { BackButton } from "@/components/BackButton"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const { error: queryError, message } = await searchParams
  const numericId = Number(id)

  if (Number.isNaN(numericId)) {
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid ID</p>
        <BackButton href="/applicants" />
      </div>
    )
  }

  const { data, error } = await supabase.from("applicants").select("*").eq("id", numericId).maybeSingle()

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Applicant not found</p>
        <BackButton href="/applicants" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Edit Applicant</h1>
            <p className="mt-1 text-sm text-gray-500">{formatApplicantRef(numericId)}</p>
          </div>
          <BackButton href="/applicants" />
        </div>

        {queryError === "status" && message && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">{decodeURIComponent(message)}</div>
        )}

        <EditApplicantForm applicant={data as Record<string, unknown>} />
      </div>
    </div>
  )
}
