import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect all app routes (dashboard, leads, pipeline, etc.)
  // Allow access to auth routes and the landing page
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isMarketingRoute =
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname === '/early-access' ||
    request.nextUrl.pathname === '/features' ||
    request.nextUrl.pathname.startsWith('/waitlist') ||
    request.nextUrl.pathname === '/api/waitlist' ||
    request.nextUrl.pathname === '/pricing' ||
    request.nextUrl.pathname.startsWith('/platform') ||
    request.nextUrl.pathname.startsWith('/growth') ||
    request.nextUrl.pathname.startsWith('/automation') ||
    request.nextUrl.pathname.startsWith('/industries') ||
    request.nextUrl.pathname.startsWith('/resources') ||
    request.nextUrl.pathname.startsWith('/q/') ||
    request.nextUrl.pathname.startsWith('/api/q/')
  const isPublicRoute = isAuthRoute || isMarketingRoute

  // Redirect unauthenticated visitors at / to the public landing page
  if (!user && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/early-access'
    return NextResponse.redirect(url)
  }

  if (!user && !isPublicRoute) {
    // No user and trying to access protected route - redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // User is logged in but on auth page - redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
