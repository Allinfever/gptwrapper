export const dynamic = 'force-dynamic'

export async function GET() {
  const envPresence = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_PAT: !!process.env.SUPABASE_PAT,
    SUPABASE_PROJECT_REF: !!process.env.SUPABASE_PROJECT_REF,
  }

  let management:
    | { ok: true; projectCount: number; projects?: Array<{ id: string; name: string; ref: string }> }
    | { ok: false; error: string }
    | undefined

  const pat = process.env.SUPABASE_PAT
  try {
    if (pat) {
      const resp = await fetch('https://api.supabase.com/v1/projects', {
        headers: {
          Authorization: `Bearer ${pat}`,
          Accept: 'application/json',
        },
        // Avoid Next fetch caching
        cache: 'no-store',
      })
      if (!resp.ok) {
        const text = await resp.text()
        management = { ok: false, error: `HTTP ${resp.status}: ${text.slice(0, 200)}` }
      } else {
        const data: Array<{ id: string; name: string; ref: string }> = await resp.json()
        management = {
          ok: true,
          projectCount: data.length,
          // Return minimal info only
          projects: data.slice(0, 3).map((p) => ({ id: p.id, name: p.name, ref: p.ref })),
        }
      }
    }
  } catch (e: any) {
    management = { ok: false, error: e?.message || 'Unknown error' }
  }

  return new Response(
    JSON.stringify({ envPresence, management }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
