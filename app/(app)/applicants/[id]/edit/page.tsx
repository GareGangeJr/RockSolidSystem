"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

type Applicant = {
  id: number
  first_name: string | null
  last_name: string | null
  position_applied: string | null
  status: string | null
  contact_number: string | null
  email: string | null
}

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const client = supabase()

  const [applicant, setApplicant] = useState<Applicant | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const [saving, setSaving] = useState(false)

  const id = Number(params.id)

  useEffect(() => {
    async function fetchApplicant() {
      const { data, error } = await client
        .from("applicants")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        setErrorMsg("Applicant not found")
        setLoading(false)
        return
      }

      setApplicant(data)
      setLoading(false)
    }

    if (!isNaN(id)) {
      fetchApplicant()
    } else {
      setErrorMsg("Invalid ID")
      setLoading(false)
    }
  }, [id])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!applicant) return

    setSaving(true)

    const { error } = await client
      .from("applicants")
      .update({
        first_name: applicant.first_name,
        last_name: applicant.last_name,
        position_applied: applicant.position_applied, // ✅ fixed
        status: applicant.status,
        contact_number: applicant.contact_number,
        email: applicant.email,
      })
      .eq("id", applicant.id)

    setSaving(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    router.push("/applicants")
    router.refresh()
  }

  if (loading) return <div className="p-6">Loading...</div>

  if (errorMsg) {
    return (
      <div className="p-6">
        <p className="text-red-500">{errorMsg}</p>
        <Link href="/applicants" className="text-blue-600 underline">
          Back
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Applicant</h1>

      <form onSubmit={handleUpdate} className="space-y-3 bg-white shadow p-4 rounded-lg">
        <input
          className="w-full border rounded p-2"
          value={applicant?.first_name ?? ""}
          onChange={(e) =>
            setApplicant({ ...applicant!, first_name: e.target.value })
          }
        />

        <input
          className="w-full border rounded p-2"
          value={applicant?.last_name ?? ""}
          onChange={(e) =>
            setApplicant({ ...applicant!, last_name: e.target.value })
          }
        />

        <input
          className="w-full border rounded p-2"
          value={applicant?.position_applied ?? ""}
          onChange={(e) =>
            setApplicant({ ...applicant!, position_applied: e.target.value })
          }
        />

        <select
          className="w-full border rounded p-2"
          value={applicant?.status ?? ""}
          onChange={(e) =>
            setApplicant({ ...applicant!, status: e.target.value })
          }
        >
          <option>For Processing</option>
          <option>Deployed</option>
          <option>For Deployment</option>
        </select>

        <input
          className="w-full border rounded p-2"
          value={applicant?.contact_number ?? ""}
          onChange={(e) =>
            setApplicant({ ...applicant!, contact_number: e.target.value })
          }
        />

        <input
          className="w-full border rounded p-2"
          value={applicant?.email ?? ""}
          onChange={(e) =>
            setApplicant({ ...applicant!, email: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Updating..." : "Update Applicant"}
        </button>
      </form>
    </div>
  )
}
