import { createClient } from "@supabase/supabase-js";

// Env vars set in Vercel → Project Settings → Environment Variables.
// Fallback to the project values so the app works even when env vars are missing.
const url =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://vtvargltoqxahfaqwofr.supabase.co";

const key =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dmFyZ2x0b3F4YWhmYXF3b2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjAxODQsImV4cCI6MjA5OTkzNjE4NH0.zUhvUcG0dZAaGbd3NZV0Xxl2dwSuq0vFKD9ooK9CVDY";

export const supabase = createClient(url, key);
