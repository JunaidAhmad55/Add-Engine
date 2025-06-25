
import { useCallback, useEffect, useRef, useState } from "react";
import { googleApiService, type GoogleFile } from "@/lib/google-api";
import { useToast } from "@/hooks/use-toast";

type AutoSyncInterval = 1 | 5 | 15; // in minutes

const AUTOSYNC_KEY = "gdrive_autosync_enabled";
const AUTOSYNC_INT_KEY = "gdrive_autosync_interval";

export function useGoogleDriveAutoSync(onFiles: (files: GoogleFile[]) => void) {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTOSYNC_KEY);
    return saved === "true";
  });
  const [intervalMinutes, setIntervalMinutes] = useState<AutoSyncInterval>(() => {
    const val = Number(localStorage.getItem(AUTOSYNC_INT_KEY));
    return (val === 1 || val === 5 || val === 15) ? val : 5;
  });
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start polling when enabled
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    // Sync immediately, then set interval
    doSync();

    intervalRef.current = setInterval(doSync, intervalMinutes * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line
  }, [enabled, intervalMinutes]);

  const doSync = useCallback(async () => {
    setIsSyncing(true);
    // Try to reuse token/authenticate if needed (defensive)
    if (!googleApiService.isConnected()) {
      await googleApiService.getStoredToken();
    }
    try {
      const result = await googleApiService.getDriveFiles();
      if (result.success && result.files) {
        onFiles(result.files);
        setLastSync(new Date());
        toast({ title: "Google Drive Sync", description: "Auto-sync completed successfully!" });
      } else {
        throw new Error(result.error || "Failed to fetch files.");
      }
    } catch (err: any) {
      toast({
        title: "Google Drive Sync Failed",
        description: err.message || "Could not sync with Google Drive.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  }, [onFiles, toast]);

  // persist state
  useEffect(() => {
    localStorage.setItem(AUTOSYNC_KEY, String(enabled));
  }, [enabled]);
  useEffect(() => {
    localStorage.setItem(AUTOSYNC_INT_KEY, String(intervalMinutes));
  }, [intervalMinutes]);

  return {
    enabled,
    setEnabled,
    intervalMinutes,
    setIntervalMinutes,
    lastSync,
    isSyncing,
    forceSync: doSync,
  };
}
