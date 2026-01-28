import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/app'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Use the site URL for production redirects
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin
      return NextResponse.redirect(`${siteUrl}${redirectTo}`)
    }
  }

  // Return to login with error if code exchange fails
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin
  return NextResponse.redirect(`${siteUrl}/login?error=auth_callback_error`)
}
