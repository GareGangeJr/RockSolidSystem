"use client"

import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"

export default function Topbar() {
  const supabase = createSupabaseBrowser()

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <header className="h-14 border-b border-gray-900 bg-white flex items-center justify-between px-4">
      <div className="text-sm text-grey-600">
        Rock Solid Manpower Information System
      </div>

      <Button size="sm" variant="outline" onClick={logout}>
        Logout
      </Button>
    </header>
  )
}
