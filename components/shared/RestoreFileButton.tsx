"use client"

import { restoreFileRecord } from "@/app/(app)/archive/actions"
import type { ArchivableFileTable } from "@/lib/archive"
import { RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

type RestoreFileButtonProps = {
  table: ArchivableFileTable
  fileId: number
  entityId: number
  name: string
  className?: string
}

export function RestoreFileButton({ table, fileId, entityId, name, className }: RestoreFileButtonProps) {
  const router = useRouter()

  async function handleClick() {
    if (!confirm("Are you sure you want to restore this?")) return

    const result = await restoreFileRecord(table, fileId, entityId)
    if (result.error) {
      alert(result.error.message || "Failed to restore file")
      return
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "rounded p-1 text-gray-600 hover:bg-green-100 hover:text-green-600"
      }
      title="Restore"
    >
      <RotateCcw className="h-4 w-4" />
    </button>
  )
}
