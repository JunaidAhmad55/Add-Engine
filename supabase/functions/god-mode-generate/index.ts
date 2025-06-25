
// deno-lint-ignore-file no-explicit-any
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Project-specific
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const openai_env_default = Deno.env.get("OPENAI_API_KEY");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { prompt, mode, org_id, user_id } = await req.json();

    if (!prompt || !mode || !org_id || !user_id) {
      return new Response(JSON.stringify({ error: "Missing required field(s)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Look up custom OpenAI API key, fallback to project-level if not set
    let settingsKey = openai_env_default;
    let modelHint = "gpt-4o";
    try {
      const { data: aiSettings } = await supabase.from("team_ai_settings").select("openai_api_key").eq("org_id", org_id).maybeSingle();
      if (aiSettings && aiSettings.openai_api_key) {
        settingsKey = aiSettings.openai_api_key;
      }
    } catch {}
    if (!settingsKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Enforce Quota Limit (tokens/requests, simple check)
    const { data: quotaRow } = await supabase.from("team_ai_quota").select("*").eq("org_id", org_id).maybeSingle();
    if (!quotaRow) {
      return new Response(JSON.stringify({ error: "Team quota not found." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // For simplicity, we only allow if used < quota. (1 image = 4000, 1 text = 1200 tokens estimated)
    let requiredTokens = (mode === "image") ? 4000 : 1200;
    if ((quotaRow.token_used ?? 0) + requiredTokens > quotaRow.token_quota) {
      return new Response(JSON.stringify({ error: "Team AI quota exceeded." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let output: any = null;
    let openaiResult: any = null;
    let tokenCountUsed = requiredTokens;
    let event_type = "";
    if (mode === "adcopy") {
      // --- Text/copy completion (gpt-4o)
      event_type = "copy";
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${settingsKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a world-class ad copy and marketing creative generator. Return only concise ad copy per user prompt." },
            { role: "user", content: prompt }
          ],
        }),
      });
      openaiResult = await res.json();
      // The generated text is in openaiResult.choices[0].message.content
      output = openaiResult.choices?.[0]?.message?.content || "";
      // Use actual token usage if available
      if (openaiResult.usage?.total_tokens) {
        tokenCountUsed = openaiResult.usage.total_tokens;
      }
    } else if (mode === "image") {
      // --- Image generation (gpt-image-1)
      event_type = "image";
      // More params can be given for advanced support
      const imgRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${settingsKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json",
          user: user_id,
        }),
      });
      openaiResult = await imgRes.json();
      // openaiResult.data[0].b64_json is the base64 image
      output = openaiResult.data?.[0]?.b64_json || "";
      if (openaiResult.usage?.total_tokens) {
        tokenCountUsed = openaiResult.usage.total_tokens;
      }
    } else {
      return new Response(JSON.stringify({ error: "Invalid mode." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Audit log
    await supabase.from("ai_generation_audit_log").insert({
      org_id,
      user_id,
      event_type,
      prompt,
      output: (typeof output === "string" && output.length < 10240) ? output : "[data]",
      token_count: tokenCountUsed,
    });

    // 5. Update quota
    await supabase
      .from("team_ai_quota")
      .update({ token_used: (quotaRow.token_used ?? 0) + tokenCountUsed, updated_at: new Date().toISOString() })
      .eq("org_id", org_id);

    // 6. Respond with output & metadata
    return new Response(JSON.stringify({
      result: output,
      event_type,
      openaiApiModel: mode === "image" ? "gpt-image-1" : "gpt-4o",
      prompt,
      token_used: tokenCountUsed,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("Error in god-mode-generate:", e);
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
