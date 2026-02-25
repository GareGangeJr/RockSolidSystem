import Link from "next/link"
import { addJobOrder } from "../actions"

export default function AddJobOrderPage() {
  return (
    <div className="p-6 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Add Job Order</h1>
        <Link href="/job-orders" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <form action={addJobOrder} className="bg-white rounded-lg shadow p-6 space-y-3">
        <div>
          <label className="block text-sm mb-1">Company Name</label>
          <input
            name="company"
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Country</label>
          <input name="country" className="w-full border rounded-md p-2" />
        </div>



        <div>
          <label className="block text-sm mb-1">Job Title</label>
          <input name="job_title" className="w-full border rounded-md p-2" />
        </div>



        <div>
          <label className="block text-sm mb-1">Gender</label>
          <input name="gender" className="w-full border rounded-md p-2" />
        </div>




        <div>
          <label className="block text-sm mb-1">N0. Workers</label>
          <input
            name="no_workers"
            type="number"
            defaultValue={1}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Years Experience Required</label>
          <input
            name="years_exp_required"
            type="number"
            min={0}
            defaultValue={0}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Skills Required (comma-separated)</label>
          <input
            name="skills_required"
            className="w-full border rounded-md p-2"
            placeholder="e.g. Cooking, Child Care, Driving"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Basic Salary</label>
          <input name="salary" className="w-full border rounded-md p-2" />
        </div>



        <div>
          <label className="block text-sm mb-1">Status</label>
          <select name="status" className="w-full border rounded-md p-2">
            <option>Open</option>
            <option>Filled</option>
            <option>Closed</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
      </form>
    </div>
  )
}
