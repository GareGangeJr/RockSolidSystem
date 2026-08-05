"use client"

import { restoreRecord } from "@/app/(app)/archive/actions"
import type { ArchivableTable } from "@/lib/archive"
import { RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

type RestoreButtonProps = {
  table: ArchivableTable
  id: number
  name: string
}

export function RestoreButton({ table, id, name }: RestoreButtonProps) {
  const router = useRouter()

  async function handleClick() {
    if (!confirm(`Are you sure you want to restore ${name}?`)) return

    const result = await restoreRecord(table, id)
    if (result.error) {
      alert(result.error.message || "Failed to restore record")
      return
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded p-1 text-gray-600 hover:bg-green-100 hover:text-green-600"
      title="Restore"
    >
      <RotateCcw className="h-4 w-4" />
    </button>
  )
}
