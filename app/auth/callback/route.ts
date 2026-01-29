import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/app'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        return NextResponse.redirect(`${siteUrl}${redirectTo}`)
      }
      
      console.error('[Auth Callback] Exchange error:', error.message)
    } catch (err) {
      console.error('[Auth Callback] Error:', err)
    }
  }

  // Return to login with error if code exchange fails
  return NextResponse.redirect(`${siteUrl}/login?error=auth_callback_error`)
}
