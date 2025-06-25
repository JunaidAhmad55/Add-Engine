
// Handles AIR connect/disconnect -- isolated

import { useState } from "react";
import AirIntegrationCard from "./AirIntegrationCard";
import { airApiService } from "@/lib/air-api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Props {
  refreshIntegrations: () => void;
}

const AirIntegrationContainer = ({ refreshIntegrations }: Props) => {
  const [isAirConnecting, setIsAirConnecting] = useState(false);
  const { toast } = useToast();

  async function handleConnect(apiKey: string) {
    setIsAirConnecting(true);
    const result = await airApiService.connect(apiKey);
    setIsAirConnecting(false);
    if (result.success) {
      toast({ title: "Account Connected", description: "Successfully connected your AIR account." });
      refreshIntegrations();
    } else {
      toast({ title: "Connection Failed", description: result.error || "Could not connect to AIR.", variant: "destructive" });
    }
  }

  function handleDisconnect() {
    airApiService.setApiKey("");
    toast({ title: "AIR Disconnected", description: "AIR account connection removed." });
    refreshIntegrations();
  }

  const isConnected = !!airApiService.getStoredApiKey();

  return (
    <div>
      <AirIntegrationCard
        isConnected={isConnected}
        onConnect={handleConnect}
        isAirConnecting={isAirConnecting}
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

export default AirIntegrationContainer;

