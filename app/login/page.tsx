"use client"

import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const supabase = createSupabaseBrowser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) return alert("Login failed: " + error.message)

    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white border rounded-lg p-6 space-y-4"
      >
        <img 
         src="/logo123.png" 
         alt="Rock Solid Logo" 
         className="w-24 mx-auto mb-4"
         onError={() => {}} 
        />
        <h1 className="text-2xl font-bold">Rock Solid Manpower System</h1>
        <p className="text-sm text-gray-500">
          Sign in to continue
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  )
}
