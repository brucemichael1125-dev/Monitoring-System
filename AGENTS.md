# GreenHarvest Monitoring System

React + Vite + TypeScript + Tailwind CSS SPA deployed on Vercel, backed by Supabase (PostgreSQL + Auth).

## Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Recharts
- **Backend**: Supabase (PostgreSQL + Row Level Security + Auth)
- **Hosting**: Vercel (frontend), Supabase cloud (database + auth)
- **Build tool**: Vite 8

## Development

```bash
npm install
npm run dev      # starts dev server on http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

These are also set in Vercel → Project Settings → Environment Variables.

## Key Files

- `src/App.tsx` — Main application, auth state, routing
- `src/main.tsx` — React entry point
- `src/lib/supabase.ts` — Supabase client
- `src/data/AppDataContext.tsx` — Global data context (expenses, revenues, budgets)
- `src/index.css` — Global styles and Tailwind CSS import
- `supabase/seed.sql` — Database schema + seed data (run in Supabase SQL Editor)

## Deployment

Vercel auto-deploys from the `main` branch. No build configuration needed beyond environment variables.

## Styling

Tailwind CSS v4 via the Vite plugin — no PostCSS config needed. Use utility classes directly in JSX.
