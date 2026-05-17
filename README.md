# ExpenseDesk

ExpenseDesk is a React and TypeScript workspace for employee expense submission,
manager approvals, finance review, reporting, and AI-assisted expense analysis
backed by Supabase.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase Auth, Database, Storage, and Edge Functions
- OpenAI-compatible chat completions for expense analysis

## Requirements

- Node.js 20+
- npm 10+
- A Supabase project with auth enabled

## Environment

Create a local `.env` file with:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

If you want Google sign-in, enable the Google provider in Supabase Auth and add
your local and deployed app origins to the allowed redirect URLs.

The Edge Function expects these Supabase secrets:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

`OPENAI_MODEL` and `OPENAI_BASE_URL` are optional. The defaults are
`gpt-4o-mini` and the OpenAI API base URL.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

The compiled app is emitted to `dist/` and can be served by any static hosting
provider.

## Testing

```bash
npm test
npm run lint
```

## Deployment Notes

- Configure the `VITE_SUPABASE_*` values in the frontend deployment environment.
- Apply the SQL files in `supabase/migrations` to provision the database.
- Deploy `supabase/functions/ask-ai` with the Supabase CLI and set the server-side secrets above.
- Social preview metadata uses the local `public/social-card.svg` asset.
