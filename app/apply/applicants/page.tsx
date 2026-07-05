import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { ApplicantForm } from "@/components/applicants/ApplicantForm"
import type { OpenJobOrderOption } from "@/components/applicants/job-order-select-field"

export default async function PublicApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; warning?: string; message?: string; job_order?: string }>
}) {
  const { success, error, warning, message, job_order } = await searchParams
  const defaultJobOrderId = Number(job_order)
  const preselectedJobOrderId = Number.isNaN(defaultJobOrderId) ? undefined : defaultJobOrderId

  const supabase = createSupabaseAdmin()
  const { data: orders } = await supabase
    .from("job_orders")
    .select("id, job_title, company, country")
    .eq("status", "Open")
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
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Application</h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill out the form below to apply.
        </p>
      </div>

      {success === "submitted" && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-800">
          Application submitted successfully. Thank you for applying!
          {warning === "placement" && message && (
            <p className="mt-2 text-sm">
              Note: Your application was saved, but we could not link it to the selected job order (
              {decodeURIComponent(message)}).
            </p>
          )}
          {warning === "job_closed" && (
            <p className="mt-2 text-sm">
              Note: Your application was saved, but the selected job order is no longer open.
            </p>
          )}
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

      <ApplicantForm
        mode="public"
        openJobOrders={openJobOrders}
        defaultJobOrderId={preselectedJob?.id}
        defaultCountryApplyingFor={preselectedJob?.country ?? undefined}
      />
    </div>
  )
}
