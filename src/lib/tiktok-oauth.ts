
/**
 * TikTok OAuth helper for Ads API.
 * Pops up TikTok login, requests scopes, returns { accessToken, expiresIn, open_id }.
 */
export function connectToTikTok(): Promise<{ accessToken: string; expiresIn: number; openId?: string }> {
  const CLIENT_KEY = "YOUR_TIKTOK_CLIENT_KEY"; // TODO: Replace with your TikTok Client Key
  const REDIRECT_URI = window.location.origin + "/tiktok-oauth-callback";
  const SCOPES = [
    "user.info.basic"
    // For business use, add more scopes as needed.
  ].join(",");

  // TikTok OAuth2 "implicit" flow for client-side apps:
  const url = [
    "https://www.tiktok.com/v2/auth/authorize/",
    `?client_key=${CLIENT_KEY}`,
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    `&response_type=token`,
    `&scope=${encodeURIComponent(SCOPES)}`,
    `&state=ads-connect`
  ].join("");

  return new Promise((resolve, reject) => {
    const width = 520, height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      "TikTokOAuth",
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
    );

    function handleMessage(e: MessageEvent) {
      if (typeof e.data === "string" && e.data.startsWith("oauth-tiktok-ads:")) {
        window.removeEventListener("message", handleMessage);
        popup?.close();
        try {
          const payload = JSON.parse(e.data.replace("oauth-tiktok-ads:", ""));
          if (payload.access_token) {
            resolve({
              accessToken: payload.access_token,
              expiresIn: Number(payload.expires_in),
              openId: payload.open_id
            });
          } else {
            reject(new Error("OAuth failed to return access_token"));
          }
        } catch (err) {
          reject(new Error("Could not parse TikTok OAuth response"));
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
