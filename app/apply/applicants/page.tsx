import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { ApplicantForm } from "@/components/applicants/ApplicantForm"
import type { OpenJobOrderOption } from "@/components/applicants/job-order-select-field"

export const dynamic = "force-dynamic"

export default async function PublicApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; message?: string; job_order?: string }>
}) {
  const { success, error, message, job_order } = await searchParams
  const defaultJobOrderId = Number(job_order)
  const preselectedJobOrderId = Number.isNaN(defaultJobOrderId) ? undefined : defaultJobOrderId

  const supabase = createSupabaseAdmin()
  const { data: orders } = await supabase
    .from("job_orders")
    .select("id, job_title, company, country")
    .eq("status", "Open")
    .is("archived_at", null)
    .order("created_at", { ascending: false })

  const openJobOrders: OpenJobOrderOption[] = (orders ?? []).map((order) => ({
    id: order.id,
    job_title: order.job_title ?? null,
    company: order.company ?? null,
    country: order.country ?? null,
  }))

  const preselectedJob = preselectedJobOrderId
    ? openJobOrders.find((job) => job.id === preselectedJobOrderId)
    : null

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Application</h1>
        <p className="mt-1 text-sm text-gray-600">Fill out the form below to apply.</p>
      </div>

      {success === "submitted" && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-800">
          Application submitted successfully. Thank you for applying!
        </div>
      )}
      {error === "submit" && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">
          Could not submit your application. Please try again.
        </div>
      )}
      {error === "invalid" && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">
          Please check required fields and try again.
        </div>
      )}
      {error === "underage" && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">
          {message
            ? decodeURIComponent(message)
            : "Applicants must be at least 18 years old."}
        </div>
      )}

      <ApplicantForm
        mode="public"
        openJobOrders={openJobOrders}
        defaultJobOrderId={preselectedJob?.id}
        defaultCountryApplyingFor={preselectedJob?.country ?? undefined}
      />
    </div>
  )
}
