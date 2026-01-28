# Supabase Setup for gptwrapper

1. Add these variables to .env.local:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

2. Use helpers:
- Client: gptwrapper/lib/supabase-browser.ts
- Server: gptwrapper/lib/supabase-server.ts

3. Install dependency:

```bash
npm install @supabase/supabase-js
```

4. In production, configure the same variables in your hosting provider's environment settings.
