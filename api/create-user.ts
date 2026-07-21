// Vercel Edge Function — creates a Supabase auth user via the Admin API.
// Requires SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.
// The service role key never reaches the browser; the admin's session is never touched.
export const config = { runtime: "edge" };

const SUPABASE_URL = "https://vtvargltoqxahfaqwofr.supabase.co";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return json({ error: "Server misconfigured: add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables" }, 500);
  }

  // Verify the caller is authenticated
  const authHeader = req.headers.get("authorization") ?? "";
  const callerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!callerToken) return json({ error: "Unauthorized" }, 401);

  // Validate caller's JWT and get their user id
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${callerToken}` },
  });
  if (!userRes.ok) return json({ error: "Unauthorized" }, 401);
  const callerUser = await userRes.json();

  // Confirm caller is an admin
  const profRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?auth_id=eq.${encodeURIComponent(callerUser.id)}&select=role&limit=1`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: "application/json",
      },
    }
  );
  const profiles = await profRes.json();
  if (!Array.isArray(profiles) || profiles[0]?.role !== "admin") {
    return json({ error: "Forbidden: admin access required" }, 403);
  }

  const { email, password, full_name, username, role, phone } = await req.json();

  // Create the auth user. email_confirm:true bypasses confirmation regardless
  // of the Supabase project's email confirmation setting.
  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, username, role, phone },
    }),
  });

  const createData = await createRes.json();
  if (!createRes.ok) {
    const msg = createData.msg ?? createData.message ?? createData.error ?? "Failed to create user";
    return json({ error: msg }, 400);
  }

  // Explicitly upsert the profile in case the DB trigger failed silently.
  const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?on_conflict=auth_id`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      auth_id:   createData.id,
      full_name: full_name.trim(),
      username:  username.toLowerCase().trim(),
      role,
      email:     email.trim().toLowerCase(),
      phone:     phone.trim(),
    }),
  });

  if (!upsertRes.ok) {
    const upsertData = await upsertRes.json().catch(() => ({}));
    return json({ error: `User created but profile setup failed: ${upsertData.message ?? upsertData.hint ?? "unknown error"}` }, 500);
  }

  return json({ user: { id: createData.id, email: createData.email } }, 201);
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
