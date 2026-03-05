"use client"

import { createEmployeeLogin } from "@/app/(app)/employees/actions"
import { useRouter } from "next/navigation"
import { KeyRound } from "lucide-react"

type Props = {
  employeeId: number
  employeeName: string
}

export default function CreateEmployeeLoginButton({ employeeId, employeeName }: Props) {
  const router = useRouter()

  async function handleClick() {
    const password = prompt(`Create login for ${employeeName}. Enter initial password (min 6 chars):`)
    if (!password?.trim()) return
    if (password.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    const { error } = await createEmployeeLogin(employeeId, password)
    if (error) {
      alert(error.message || "Failed to create login")
      return
    }
    alert("Login created! They can now sign in with their email and this password.")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded p-1 text-gray-600 hover:bg-green-100 hover:text-green-600"
      title="Create Login"
    >
      <KeyRound className="h-4 w-4" />
    </button>
  )
}
