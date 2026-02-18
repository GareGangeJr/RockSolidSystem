"use client"

import { useState } from "react"
import { Trash } from "lucide-react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"

export default function DeleteApplicantButton({ id }: { id: number }) {
  const supabase = createSupabaseBrowser()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function doDelete() {
    setLoading(true)

    const { error } = await supabase.from("applicants").delete().eq("id", id)

    setLoading(false)

    if (error) {
      alert("Delete failed: " + error.message)
      return
    }

    setOpen(false)
    window.location.reload()
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        className="p-1 rounded-md text-black hover:bg-red-100 hover:text-red-600 transition"
        title="Delete"
      >
        <Trash className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-lg p-5 shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this applicant? This cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md border hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={doDelete}
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
