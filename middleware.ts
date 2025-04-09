import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and trying to access protected routes
  if (!session) {
    const isProtectedRoute =
      req.nextUrl.pathname.startsWith("/patient") || req.nextUrl.pathname.startsWith("/therapist")

    if (isProtectedRoute) {
      const redirectUrl = new URL("/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If session exists, check user type for correct routing
  if (session) {
    const { data: userData } = await supabase.from("users").select("user_type").eq("id", session.user.id).single()

    // Redirect if user is trying to access the wrong dashboard
    if (userData) {
      const isPatient = userData.user_type === "patient"
      const isTherapist = userData.user_type === "therapist"

      if (isPatient && req.nextUrl.pathname.startsWith("/therapist")) {
        const redirectUrl = new URL("/patient/dashboard", req.url)
        return NextResponse.redirect(redirectUrl)
      }

      if (isTherapist && req.nextUrl.pathname.startsWith("/patient")) {
        const redirectUrl = new URL("/therapist/dashboard", req.url)
        return NextResponse.redirect(redirectUrl)
      }

      // Redirect from login page if already authenticated
      if (req.nextUrl.pathname === "/login") {
        const redirectUrl = new URL(isPatient ? "/patient/dashboard" : "/therapist/dashboard", req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return res
}

export const config = {
  matcher: ["/patient/:path*", "/therapist/:path*", "/login"],
}
