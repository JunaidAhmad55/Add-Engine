
import { useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";

const MetaOAuthCallback = () => {
  const { userProfile } = useUserProfile();

  useEffect(() => {
    const doExchange = async () => {
      // Extract code from query (?code=...)
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (code && userProfile?.id && userProfile?.team_id) {
        try {
          // Call our edge function to do the exchange and storage
          const res = await fetch("/functions/v1/meta-oauth-exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              redirect_uri: `${window.location.origin}/meta-oauth-callback`,
              user_id: userProfile.id,
              team_id: userProfile.team_id,
            })
          });
          const data = await res.json();
          if (data.ok) {
            // Optionally store a success, maybe notify opener
            if (window.opener) {
              window.opener.postMessage(
                "oauth-meta-ads:" + JSON.stringify({
                  access_token: data.access_token,
                  expires_in: data.expires_in,
                  user_id: userProfile.id
                }),
                window.location.origin
              );
            }
          }
        } catch (e) {
          // Notify failure to opener
          if (window.opener)
            window.opener.postMessage("oauth-meta-ads:" + JSON.stringify({ error: e?.toString() }), window.location.origin);
        }
      } else if (error && window.opener) {
        window.opener.postMessage("oauth-meta-ads:" + JSON.stringify({ error }), window.location.origin);
      }

      setTimeout(() => window.close(), 800);
    };

    doExchange();
  }, [userProfile]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 bg-white rounded shadow-md text-center">
        <h2 className="text-lg font-medium mb-2">Meta Connected</h2>
        <p className="text-gray-500">You can close this window now.</p>
      </div>
    </div>
  );
};

export default MetaOAuthCallback;
