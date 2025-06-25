
import { useEffect } from "react";

const TikTokOAuthCallback = () => {
  useEffect(() => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const access_token = params.get("access_token");
      const expires_in = params.get("expires_in");
      const open_id = params.get("open_id");
      if (window.opener && access_token) {
        window.opener.postMessage(
          "oauth-tiktok-ads:" + JSON.stringify({ access_token, expires_in, open_id }),
          window.location.origin
        );
      }
    }
    setTimeout(() => window.close(), 250);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 bg-white rounded shadow-md text-center">
        <h2 className="text-lg font-medium mb-2">TikTok Connected</h2>
        <p className="text-gray-500">You can close this window now.</p>
      </div>
    </div>
  );
};

export default TikTokOAuthCallback;
