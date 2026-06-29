import { addJobOrder } from "../actions"
import { BackButton } from "@/components/BackButton"
import { JobOrderFormFields } from "@/components/job-orders/JobOrderFormFields"

export default function AddJobOrderPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Add Job Order</h1>
          <BackButton href="/job-orders" />
        </div>

        <form action={addJobOrder} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <JobOrderFormFields />

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Job Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
