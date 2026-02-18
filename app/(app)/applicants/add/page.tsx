import Link from "next/link"
import { addApplicant } from "../actions"

export default function AddApplicantPage() {
  return (
    <div className="p-6 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Add Applicant</h1>
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>

      <form action={addApplicant} className="bg-white rounded-lg shadow p-4 space-y-3">
        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input name="first_name" className="w-full border rounded-md p-2" required />
        </div>

        <div>
          <label className="block text-sm mb-1">Last Name</label>
          <input name="last_name" className="w-full border rounded-md p-2" required />
        </div>

        <div>
          <label className="block text-sm mb-1">Position Applied</label>
          <input name="position_applied" className="w-full border rounded-md p-2" required />
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select name="status" className="w-full border rounded-md p-2">
            <option>For Processing</option>
            <option>Deployed</option>
            <option>For Deployment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Contact Number</label>
          <input name="contact_number" className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Years of Experience</label>
          <input name="years_of_exp" type="number" min={0} defaultValue={0} className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Skills (comma-separated)</label>
          <input name="skills" className="w-full border rounded-md p-2" placeholder="e.g. Cooking, Child Care, Driving" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Save Applicant
        </button>
      </form>
    </div>
  )
}
