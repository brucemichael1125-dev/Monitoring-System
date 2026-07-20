import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  document.body.innerHTML = `
    <div style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8fafc;">
      <div style="max-width:480px;padding:40px;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.1);border:1px solid #e2e8f0;text-align:center;">
        <div style="font-size:40px;margin-bottom:16px;">⚙️</div>
        <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;">Supabase Not Configured</h2>
        <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 20px;">
          The environment variables are missing. Add these in<br/>
          <strong>Vercel → Project Settings → Environment Variables</strong>:
        </p>
        <div style="background:#f1f5f9;border-radius:8px;padding:16px;text-align:left;font-family:monospace;font-size:13px;color:#334155;">
          VITE_SUPABASE_URL<br/>
          VITE_SUPABASE_ANON_KEY
        </div>
        <p style="color:#94a3b8;font-size:12px;margin:16px 0 0;">
          Get these values from Supabase → Project Settings → API
        </p>
      </div>
    </div>`;
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set.");
}

export const supabase = createClient(url, key);
