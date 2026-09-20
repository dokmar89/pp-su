# PassProve — Supabase portal and verification prototype

A Next.js portal variant combining customer workflows, registration administration and verification-function experiments.

**Status:** Legacy/parallel PassProve implementation retained for reference; not presented as the canonical production release.

## Scope

- Account, e-shop, customization and support screens.
- Admin registration pages and API route source.
- Supabase function source for verification methods, codes and invoices.

## Technology

Next.js, React, TypeScript, Tailwind CSS, Supabase.

## Architecture and source map

- `src/app/` — portal pages and API handlers
- `src/components/` — customer and verification UI
- `src/lib/` — Supabase and data hooks
- `supabase/functions/` — function source

## Local development

Requires Node.js and npm. From the repository root:

```sh
npm install
npm run dev
```

Build command declared by this checkout: `npm run build`.

These are the repository scripts, not a claim of a passing build. Dependency installation, build and live integrations were not executed during the documentation review.

## Configuration and limitations

Use separate development services and validate Supabase policies and provider callbacks. Configuration files include `.env.example` and a legacy environment file under `src/lib`; do not reuse committed credentials. Some API/function paths represent unfinished integration work.

## Documentation next steps

Capture screenshots using synthetic data, document a reproducible test run, and record which integrations have been verified. Keep credentials and deployment-specific configuration outside version control.
