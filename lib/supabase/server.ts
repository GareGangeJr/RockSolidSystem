
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export function createSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Call `cookies()` at use time and defensively access `.get`
          const store = cookies() as any
          const cookie = typeof store.get === "function" ? store.get(name) : undefined
          return cookie?.value
        },
      },
    }
  )
}


