
// Handles all connect/disconnect logic for Google Drive. Focused and independent.

import { useState } from "react";
import GoogleDriveIntegrationCard from "./GoogleDriveIntegrationCard";
import { useToast } from "@/hooks/use-toast";
import { connectToGoogleDrive } from "@/lib/google-oauth";
import { upsertTeamIntegration } from "@/lib/account-integrations";
import { Button } from "@/components/ui/button";

interface Props {
  teamIntegrations: any[];
  teamId: string | undefined;
  refreshIntegrations: () => void;
}

const GoogleDriveIntegrationContainer = ({ teamIntegrations, teamId, refreshIntegrations }: Props) => {
  const [isDriveConnecting, setIsDriveConnecting] = useState(false);
  const { toast } = useToast();

  const driveIntegration = teamIntegrations.find(acc => acc.platform === "google_drive");
  const isConnected = !!driveIntegration;
  const expiresIn = driveIntegration?.expires_in ?? null;

  async function handleConnect() {
    setIsDriveConnecting(true);
    try {
      const result = await connectToGoogleDrive();
      await upsertTeamIntegration({
        teamId,
        platform: "google_drive",
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
      });
      refreshIntegrations();
      toast({ title: "Account Connected", description: "Successfully connected your Google Drive account." });
    } catch (err: any) {
      toast({
        title: "Google Drive Connection Failed",
        description: err?.message || "Could not connect to Google Drive.",
        variant: "destructive"
      });
    } finally {
      setIsDriveConnecting(false);
    }
  }

  async function handleDisconnect() {
    if (!teamId || !isConnected) return;
    await upsertTeamIntegration({
      teamId,
      platform: "google_drive",
      accessToken: null,
      expiresIn: null,
      providerAccountId: null,
    });
    toast({ title: "Disconnected", description: "Successfully disconnected your Google Drive account." });
    refreshIntegrations();
  }

  return (
    <div>
      <GoogleDriveIntegrationCard
        isConnected={isConnected}
        isDriveConnecting={isDriveConnecting}
        onConnect={handleConnect}
        onDisconnect={isConnected ? handleDisconnect : undefined}
        expiresIn={expiresIn}
      />
      {isConnected && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="ml-2 mt-2"
        >
          Disconnect
        </Button>
      )}
    </div>
  );
};

export default GoogleDriveIntegrationContainer;

