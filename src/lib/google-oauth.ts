
/**
 * Helper to launch Google OAuth for the Drive/Picker APIs.
 * - Opens a popup to Google's OAuth endpoint, requesting appropriate scopes.
 * - Resolves with { accessToken, expiresIn } if successful.
 * - Replaces static tokens with real OAuth login.
 */
export function connectToGoogleDrive(): Promise<{ accessToken: string; expiresIn: number }> {
  const CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID"; // TODO: Replace with your real Google OAuth Client ID
  const REDIRECT_URI = window.location.origin + "/google-oauth-callback"; // Should match Google's allowed redirect URIs
  const SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.file",
    "email",
    "profile",
  ].join(" ");

  // Construct Google's OAuth URL
  const url = [
    "https://accounts.google.com/o/oauth2/v2/auth",
    `?client_id=${CLIENT_ID}`,
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    `&response_type=token`,
    `&scope=${encodeURIComponent(SCOPES)}`,
    `&prompt=consent`,
    `&include_granted_scopes=true`,
    `&access_type=online`
  ].join("");

  return new Promise((resolve, reject) => {
    // Centered popup
    const width = 520, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      "GoogleOAuth",
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
    );

    // Monitor popup for access token
    function handleMessage(e: MessageEvent) {
      if (typeof e.data === "string" && e.data.startsWith("oauth-google-drive:")) {
        window.removeEventListener("message", handleMessage);
        popup?.close();
        try {
          const payload = JSON.parse(e.data.replace("oauth-google-drive:", ""));
          if (payload.access_token) {
            resolve({ accessToken: payload.access_token, expiresIn: Number(payload.expires_in) });
          } else {
            reject(new Error("OAuth failed to return access_token"));
          }
        } catch (err) {
          reject(new Error("Could not parse OAuth response"));
        }
      }
    }

    window.addEventListener("message", handleMessage);

    // Fallback
    const timer = setInterval(() => {
      if (popup && popup.closed) {
        window.removeEventListener("message", handleMessage);
        clearInterval(timer);
        reject(new Error("Popup closed or OAuth cancelled"));
      }
    }, 500);
  });
}

