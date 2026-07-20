import { createClient } from "@supabase/supabase-js";

const ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dmFyZ2x0b3F4YWhmYXF3b2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjAxODQsImV4cCI6MjA5OTkzNjE4NH0.zUhvUcG0dZAaGbd3NZV0Xxl2dwSuq0vFKD9ooK9CVDY";

// In dev, hit Supabase directly. In production, route through the Vercel proxy
// (vercel.json rewrites /supabase/* → https://vtvargltoqxahfaqwofr.supabase.co/*)
// so the browser makes same-origin requests and avoids any network/CORS issues.
const SUPABASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_SUPABASE_URL as string) || "https://vtvargltoqxahfaqwofr.supabase.co"
  : `${window.location.origin}/supabase`;

export const supabase = createClient(SUPABASE_URL, ANON_KEY);
