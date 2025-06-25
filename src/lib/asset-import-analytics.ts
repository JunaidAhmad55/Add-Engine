
export type AssetImportSource = "Upload" | "Google Drive" | "TikTok" | "AIR" | "Meta";

export type AssetImportAnalytics = {
  [key in AssetImportSource]: number;
};

const STORAGE_KEY = "asset_import_analytics";

export function getAssetImportAnalytics(): AssetImportAnalytics {
  if (typeof window === "undefined") return {
    Upload: 0, "Google Drive": 0, TikTok: 0, AIR: 0, Meta: 0,
  };
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return {
      Upload: 0,
      "Google Drive": 0,
      TikTok: 0,
      AIR: 0,
      Meta: 0,
    };
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return {
      Upload: 0,
      "Google Drive": 0,
      TikTok: 0,
      AIR: 0,
      Meta: 0,
    };
  }
}

export function incrementAssetImportAnalytics(source: AssetImportSource, count: number) {
  const analytics = getAssetImportAnalytics();
  analytics[source] = (analytics[source] || 0) + count;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
}

export function resetAssetImportAnalytics() {
  localStorage.removeItem(STORAGE_KEY);
}
