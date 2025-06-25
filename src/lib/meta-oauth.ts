
/**
 * Launch Meta (Facebook) OAuth for Ads API.
 * Uses server-side token exchange for security.
 */
export function connectToMeta(): Promise<{ accessToken: string; expiresIn: number; userId?: string }> {
  // The App ID is not referenced here directly; the Auth endpoint redirects to the callback with a code.
  const APP_ID = "__SERVER_SIDE__"; // not used on client
  const REDIRECT_URI = window.location.origin + "/meta-oauth-callback";
  const SCOPES = [
    "ads_management",
    "business_management",
    "email",
    "public_profile"
  ].join(',');

  const url = [
    "https://www.facebook.com/v21.0/dialog/oauth",
    `?client_id=${import.meta.env.VITE_META_APP_ID ?? "YOUR_META_APP_ID"}`,
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    `&response_type=code`,
    `&scope=${encodeURIComponent(SCOPES)}`,
    `&state=ads-connect`
  ].join("");

  return new Promise((resolve, reject) => {
    const width = 520, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      "MetaOAuth",
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
    );

    function handleMessage(e: MessageEvent) {
      if (typeof e.data === "string" && e.data.startsWith("oauth-meta-ads:")) {
        window.removeEventListener("message", handleMessage);
        popup?.close();
        try {
          const payload = JSON.parse(e.data.replace("oauth-meta-ads:", ""));
          if (payload.access_token) {
            resolve({
              accessToken: payload.access_token,
              expiresIn: Number(payload.expires_in),
              userId: payload.user_id
            });
          } else if (payload.error) {
            reject(new Error(payload.error));
          } else {
            reject(new Error("Meta OAuth callback: unknown response"));
          }
        } catch (err) {
          reject(new Error("Could not parse Meta OAuth response"));
        }
      }
    }

    window.addEventListener("message", handleMessage);

    const timer = setInterval(() => {
      if (popup && popup.closed) {
        window.removeEventListener("message", handleMessage);
        clearInterval(timer);
        reject(new Error("Popup closed or OAuth cancelled"));
      }
    }, 500);
  });
}
