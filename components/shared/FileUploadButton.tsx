"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"]

type FileUploadButtonProps = {
  entityId: number
  storageBucket: string
  filesTable: string
  entityIdColumn: string
}

export function FileUploadButton({
  entityId,
  storageBucket,
  filesTable,
  entityIdColumn,
}: FileUploadButtonProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)
  const inputId = `upload-${filesTable}-${entityId}`

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""
    setMessage(null)

    if (file.size > MAX_BYTES) {
      setMessage({ type: "error", text: "File too large. Maximum size is 5 MB." })
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({ type: "error", text: "Only PDF, JPG, and PNG files are allowed." })
      return
    }

    setUploading(true)
    const supabase = createSupabaseBrowser()
    const filePath = `${entityId}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`

    const { error: uploadError } = await supabase.storage.from(storageBucket).upload(filePath, file)
    if (uploadError) {
      setUploading(false)
      setMessage({ type: "error", text: uploadError.message })
      return
    }

    const { error: dbError } = await supabase.from(filesTable).insert({
      [entityIdColumn]: entityId,
      file_name: file.name,
      file_path: filePath,
    })

    setUploading(false)
    if (dbError) {
      setMessage({ type: "error", text: dbError.message })
      return
    }

    setMessage({ type: "success", text: "File uploaded." })
    router.refresh()
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <input
        type="file"
        id={inputId}
        className="hidden"
        onChange={handleUpload}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <button
        type="button"
        onClick={() => document.getElementById(inputId)?.click()}
        disabled={uploading}
        className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
          uploading
            ? "cursor-not-allowed border-gray-300 text-gray-400"
            : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {message && (
        <p className={`text-xs ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
