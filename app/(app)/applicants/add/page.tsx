"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"


export default function AddApplicantPage() {
  const router = useRouter()
  const client = supabase()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [positionApp, setPositionApp] = useState("")
  const [status, setStatus] = useState("For Processing")
  const [contactNum, setContactNum] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")
    setSaving(true)

    const { error } = await client.from("applicants").insert({
      first_name: firstName,
      last_name: lastName,
      position_applied: positionApp,
      status: status,
      contact_number: contactNum,
      email: email,
    })

    setSaving(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    router.push("/applicants")
    router.refresh()
  }

  return (
    <div className="p-6 max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Add Applicant</h1>

        <Link href="/applicants" className="text-sm text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
        {errorMsg && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input
            className="w-full border rounded-md p-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Last Name</label>
          <input
            className="w-full border rounded-md p-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Position Applied</label>
          <input
            className="w-full border rounded-md p-2"
            value={positionApp}
            onChange={(e) => setPositionApp(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            className="w-full border rounded-md p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>For Processing</option>
            <option>Deployed</option>
            <option>For Deployment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Contact Number</label>
          <input
            className="w-full border rounded-md p-2"
            value={contactNum}
            onChange={(e) => setContactNum(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Applicant"}
        </button>
      </form>
    </div>
  )
}
