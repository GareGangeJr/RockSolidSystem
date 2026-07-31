"use client"

import Link from "next/link"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"

export default function Topbar() {
  const supabase = createSupabaseBrowser()

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-900 bg-white px-4">
      <div className="text-sm text-gray-600">Rock Solid Manpower Information System</div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link href="/account/password">Change Password</Link>
        </Button>
        <Button size="sm" variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
