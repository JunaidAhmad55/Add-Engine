
// Google OAuth callback page: receives #access_token in hash fragment,
// relays token to opener, then immediately closes itself.
import { useEffect } from "react";

const GoogleOAuthCallback = () => {
  useEffect(() => {
    // If redirected with a hash, parse and send message to opener window.
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const access_token = params.get("access_token");
      const expires_in = params.get("expires_in");
      if (window.opener && access_token) {
        window.opener.postMessage(
          "oauth-google-drive:" + JSON.stringify({ access_token, expires_in }),
          window.location.origin
        );
      }
    }
    // Close soon after
    setTimeout(() => window.close(), 250);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 bg-white rounded shadow-md text-center">
        <h2 className="text-lg font-medium mb-2">Google Drive Connected</h2>
        <p className="text-gray-500">You can close this window now.</p>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
