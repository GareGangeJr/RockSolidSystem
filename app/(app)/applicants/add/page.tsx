import { createSupabaseServer } from "@/lib/supabase/server"
import { ApplicantForm } from "@/components/applicants/ApplicantForm"
import { BackButton } from "@/components/BackButton"
import { fetchOpenJobOrdersForApplicantForm } from "@/lib/fetch-open-job-orders"

export default async function AddApplicantPage() {
  const supabase = await createSupabaseServer()
  const { openJobOrders } = await fetchOpenJobOrdersForApplicantForm(supabase)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Add Applicant</h1>
          <BackButton href="/applicants" />
        </div>

        <ApplicantForm openJobOrders={openJobOrders} />
      </div>
    </div>
  )
}
