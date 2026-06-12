import { AddApplicantForm } from "@/components/applicants/AddApplicantForm"
import { BackButton } from "@/components/BackButton"

export default function AddApplicantPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Add Applicant</h1>
          <BackButton href="/applicants" />
        </div>

        <AddApplicantForm />
      </div>
    </div>
  )
}
