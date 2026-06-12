import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { canAccessPath, getAccessRole } from "@/lib/user-role"

export async function proxy(request: any) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data } = await supabase.auth.getUser()
  const user = data.user

  const path = request.nextUrl.pathname
  const isServerAction = request.headers.has("next-action")
  const isRscRequest = request.headers.has("rsc")

  const isPublicFile = /\.(.*)$/.test(path)
  if (isPublicFile) {
    return response
  }

  const isLoginPage = path.startsWith("/login")
  const isApplyPortal = path.startsWith("/apply")

  if (!user && !isLoginPage && !isApplyPortal) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && isLoginPage && !isServerAction && !isRscRequest) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (user && !isApplyPortal && !isLoginPage) {
    const role = await getAccessRole(supabase, user.id)
    if (role === "staff" && !canAccessPath(role, path)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
