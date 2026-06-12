"use client"

import { disableEmployeeLogin } from "@/app/(app)/employees/actions"
import { useRouter } from "next/navigation"
import { KeyRound } from "lucide-react"

type Props = {
  employeeId: number
  employeeName: string
}

export default function DisableEmployeeLoginButton({ employeeId, employeeName }: Props) {
  const router = useRouter()

  async function handleClick() {
    const ok = confirm(`Disable login for ${employeeName}?`)
    if (!ok) return

    const result = await disableEmployeeLogin(employeeId)
    if (result.error) {
      alert(result.error.message || "Failed to disable login")
      return
    }

    alert("Login disabled.")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded p-1 text-gray-600 hover:bg-red-100 hover:text-red-600"
      title="Disable Login"
    >
      <KeyRound className="h-4 w-4 rotate-45" />
    </button>
  )
}
