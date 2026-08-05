import { createSupabaseServer } from "@/lib/supabase/server"
import { ApplicantForm } from "@/components/applicants/ApplicantForm"
import { BackButton } from "@/components/BackButton"
import { fetchOpenJobOrdersForApplicantForm } from "@/lib/fetch-open-job-orders"

export default async function AddApplicantPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams
  const supabase = await createSupabaseServer()
  const { openJobOrders } = await fetchOpenJobOrdersForApplicantForm(supabase)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Add Applicant</h1>
        <BackButton href="/applicants" />
      </div>

      {error && message && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">{decodeURIComponent(message)}</div>
      )}

      <ApplicantForm openJobOrders={openJobOrders} />
    </div>
  )
}
