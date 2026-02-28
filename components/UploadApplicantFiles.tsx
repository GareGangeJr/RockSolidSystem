"use client"

import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"]

export default function UploadApplicantFile({ id }: { id: number }) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    if (file.size > MAX_SIZE) return alert("File too large. Max is 5MB.")
    if (!ALLOWED_TYPES.includes(file.type)) return alert("Invalid file type. Only PDF, JPG, PNG allowed.")

    setUploading(true)
    const supabase = createSupabaseBrowser()
    const filePath = `${id}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`

    const { error: uploadError } = await supabase.storage.from("applicant files").upload(filePath, file)
    if (uploadError) {
      setUploading(false)
      return alert("Upload failed: " + uploadError.message)
    }

    const { error: dbError } = await supabase.from("applicant_files").insert({
      applicant_id: id,
      file_name: file.name,
      file_path: filePath,
    })

    setUploading(false)
    if (dbError) return alert("DB save failed: " + dbError.message)

    alert("File uploaded!")
    window.location.reload()
  }

  return (
    <>
      <input
        type="file"
        id={`file-${id}`}
        className="hidden"
        onChange={handleUpload}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <button
        type="button"
        onClick={() => document.getElementById(`file-${id}`)?.click()}
        disabled={uploading}
        className={`px-4 py-2 rounded-md border transition text-sm font-medium ${
          uploading
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </>
  )
}
