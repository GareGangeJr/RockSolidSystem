import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getAccessRole, isAdminOnlyPath } from "@/lib/user-role"

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (/\.(.*)$/.test(path)) {
    return NextResponse.next()
  }

  if (path.startsWith("/apply") || path.startsWith("/kiosk")) {
    return NextResponse.next()
  }

  if (
    request.headers.has("rsc") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.has("next-action")
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const isLoginPage = path.startsWith("/login")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (user && isAdminOnlyPath(path)) {
    const role = await getAccessRole(supabase, user.id)
    if (role === "staff") {
      return NextResponse.redirect(new URL("/?error=access", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
