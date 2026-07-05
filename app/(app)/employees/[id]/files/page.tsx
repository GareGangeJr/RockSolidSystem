"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { FileUploadButton } from "@/components/shared/FileUploadButton"
import { BackButton } from "@/components/BackButton"

type FileRow = {
  id: number
  employee_id: number
  file_name: string | null
  file_path: string | null
  created_at: string
}

const BUCKET = "employee-files"

export default function EmployeeFilesPage() {
  const params = useParams()
  const supabase = createSupabaseBrowser()

  const employeeId = Number(params.id)

  const [files, setFiles] = useState<FileRow[]>([])
  const [loading, setLoading] = useState(true)

  async function loadFiles() {
    const { data, error } = await supabase
      .from("employee_files")
      .select("*")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false })

    if (!error && data) setFiles(data as FileRow[])
    setLoading(false)
  }

  async function signedUrl(path: string) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60)

    if (error || !data?.signedUrl) {
      alert("Signed URL failed: " + (error?.message || "unknown error"))
      return null
    }
    return data.signedUrl
  }

  async function viewFile(path: string) {
    const url = await signedUrl(path)
    if (url) window.open(url, "_blank")
  }

  async function downloadFile(path: string, name: string) {
    const url = await signedUrl(path)
    if (!url) return

    const res = await fetch(url)
    const blob = await res.blob()
    const downloadLink = document.createElement("a")
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = name || "file"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    URL.revokeObjectURL(downloadLink.href)
  }

  async function deleteFile(fileId: number, path: string) {
    if (!confirm("Delete this file?")) return

    const { error: storageError } = await supabase.storage.from(BUCKET).remove([path])
    if (storageError) return alert("Storage delete failed: " + storageError.message)

    const { error: dbError } = await supabase.from("employee_files").delete().eq("id", fileId)
    if (dbError) return alert("DB delete failed: " + dbError.message)

    loadFiles()
  }

  useEffect(() => {
    if (!isNaN(employeeId)) {
      setLoading(true)
      loadFiles()
    }
  }, [employeeId])

  if (isNaN(employeeId)) return <div className="p-6 text-red-500">Invalid employee ID</div>

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Employee Files</h1>

        <div className="flex items-center gap-3">
          <FileUploadButton
            entityId={employeeId}
            storageBucket="employee-files"
            filesTable="employee_files"
            entityIdColumn="employee_id"
          />

          <BackButton href="/employees" />
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {!loading && !files.length && <div className="text-gray-500">No files uploaded.</div>}
      {!loading && files.length > 0 && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">File Name</th>
                <th className="p-3 text-left">Uploaded</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {files.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="p-3">{f.file_name}</td>
                  <td className="p-3">
                    {new Date(f.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => viewFile(f.file_path || "")}
                        disabled={!f.file_path}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-gray-100"
                        onClick={() =>
                          downloadFile(f.file_path || "", f.file_name || "file")
                        }
                        disabled={!f.file_path}
                      >
                        Download
                      </button>

                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-red-50 hover:text-red-700"
                        onClick={() => deleteFile(f.id, f.file_path || "")}
                        disabled={!f.file_path}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
