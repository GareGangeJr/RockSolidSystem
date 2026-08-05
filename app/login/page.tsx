"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { checkEmployeeLoginAllowed } from "@/app/(app)/employees/actions"
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

    try {
      const access = await checkEmployeeLoginAllowed()
      if (!access.allowed) {
        await supabase.auth.signOut()
        return alert(access.message)
      }
    } catch {
      await supabase.auth.signOut()
      return alert("Login failed: could not verify your account. Please try again.")
    }

    window.location.href = "/"
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        <form onSubmit={handleLogin} className="w-full space-y-4 rounded-lg border bg-white p-6">
          <Image src="/logo123.png" alt="Rock Solid Logo" width={96} height={96} className="mx-auto mb-4 w-24" priority />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Rock Solid Manpower System</h1>
            <p className="mt-1 text-sm text-gray-500">Admin & staff sign in</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button type="submit" className="mx-auto block w-1/2" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="flex w-full flex-col items-center justify-center rounded-lg border bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">For Applicants</h2>
          <p className="mt-2 text-sm text-gray-600">Apply online or browse open job orders.</p>

          <Link
            href="/apply/applicants"
            className="mt-6 inline-flex w-full max-w-xs items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  )
}
