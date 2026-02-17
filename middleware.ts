import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: any) {
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

  // ✅ ALLOW public/static files like /logo123.png, /file.svg, etc.
  const isPublicFile = /\.(.*)$/.test(path)
  if (isPublicFile) {
    return response
  }

  const isLoginPage = path.startsWith("/login")

  // If not logged in, block everything except /login
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If logged in, prevent going back to /login
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
