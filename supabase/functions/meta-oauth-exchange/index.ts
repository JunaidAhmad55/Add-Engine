
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // Parse POST
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Environment secrets (Meta App ID and Secret)
  const META_APP_ID = Deno.env.get("META_APP_ID");
  const META_APP_SECRET = Deno.env.get("META_APP_SECRET");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!META_APP_ID || !META_APP_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
    return new Response("Missing config", { status: 500 });

  let body: { code?: string, redirect_uri?: string, user_id?: string, team_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { code, redirect_uri, user_id, team_id } = body;
  if (!code || !redirect_uri || !user_id || !team_id)
    return new Response("Missing param", { status: 400 });

  // 1. Exchange code for access_token
  const tokenUrl =
    `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&client_secret=${META_APP_SECRET}&code=${code}`;

  const tokenRes = await fetch(tokenUrl, { method: "GET" });
  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return new Response("Meta exchange failed: " + err, { status: 400 });
  }

  const token = await tokenRes.json();
  // Returns: { access_token, token_type, expires_in }

  // 2. Store tokens in meta_oauth_tokens (upsert by user/team)
  // Use direct PostgREST call with service role
  const insertUrl = `${SUPABASE_URL}/rest/v1/meta_oauth_tokens`;
  const now = new Date();
  const expires_at = new Date(now.getTime() + (token.expires_in || 60 * 60) * 1000).toISOString();

  // Upsert (delete old + insert new for this user/team)
  // Delete any previous tokens for user/team
  await fetch(
    `${SUPABASE_URL}/rest/v1/meta_oauth_tokens?user_id=eq.${user_id}&team_id=eq.${team_id}`,
    {
      method: "DELETE",
      headers: {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  // Insert new token
  const insertRes = await fetch(insertUrl, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify([{
      user_id,
      team_id,
      access_token: token.access_token,
      refresh_token: token.refresh_token ?? null,
      token_type: token.token_type ?? null,
      expires_at: expires_at
    }])
  });

  if (!insertRes.ok) {
    const insErr = await insertRes.text();
    return new Response("DB insert failed: " + insErr, { status: 500 });
  }
  const stored = await insertRes.json();

  return new Response(JSON.stringify({
    ok: true,
    ...token,
    stored
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
});
