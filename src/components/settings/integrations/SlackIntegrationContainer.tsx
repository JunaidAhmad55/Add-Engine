
// Slack handler container -- all logic for connect/disconnect stateful here, clean separation.

import { useState } from "react";
import SlackIntegrationCard from "./SlackIntegrationCard";
import { slackService } from "@/lib/services/slack-service";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  refreshIntegrations: () => void;
}

const SlackIntegrationContainer = ({ refreshIntegrations }: Props) => {
  const { toast } = useToast();
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(slackService.getWebhookUrl() || '');
  const [isSlackConnectDialogOpen, setIsSlackConnectDialogOpen] = useState(false);

  function handleConnect(webhookUrl: string) {
    setSlackWebhookUrl(webhookUrl);
    setIsSlackConnectDialogOpen(true);
  }

  function handleTest() {
    slackService.sendNotification("🎉 This is a test notification from Engine Ads.");
    toast({ title: "Slack Test Sent", description: "A test notification was sent to your Slack webhook." });
  }

  function handleDisconnect() {
    slackService.clearWebhookUrl();
    toast({
      title: "Slack Disconnected",
      description: "Slack notifications will no longer be sent."
    });
    refreshIntegrations();
  }

  return (
    <div>
      <SlackIntegrationCard
        isConnected={!!slackService.getWebhookUrl()}
        onConnect={handleConnect}
      />
      {!!slackService.getWebhookUrl() && (
        <div className="flex gap-2 mt-2 ml-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTest}
          >
            Test Slack Notification
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="ml-2"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default SlackIntegrationContainer;

