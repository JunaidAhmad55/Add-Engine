
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slack, CheckCircle } from "lucide-react";
import { slackService } from "@/lib/services/slack-service";
import { useToast } from "@/hooks/use-toast";

interface Props {
  isConnected: boolean;
  onConnect: (webhookUrl: string) => void;
}

const SlackIntegrationCard = ({ isConnected, onConnect }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(slackService.getWebhookUrl() || '');
  const [supportWebhookUrl, setSupportWebhookUrl] = useState(slackService.getSupportWebhookUrl() || '');
  const { toast } = useToast();

  function handleSave() {
    slackService.saveWebhookUrl(webhookUrl);
    slackService.saveSupportWebhookUrl(supportWebhookUrl);
    setDialogOpen(false);
    toast({
      title: "Slack Webhooks Saved", description: "Slack build/publish and support channels connected.",
    });
    onConnect(webhookUrl);
  }

  return (
    <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-gray-100">
          <Slack className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <p className="font-medium">Slack</p>
          <p className="text-sm text-gray-500">Build & publish notifications and support channel</p>
          {slackService.getSupportWebhookUrl() && (
            <span className="block text-xs text-emerald-700 font-medium mt-1">Support channel connected</span>
          )}
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {isConnected ? (<><CheckCircle className="mr-1.5 h-4 w-4 text-green-600 inline-block" />Connected</>) : "Connect"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect to Slack</DialogTitle>
            <DialogDescription>
              Enter your Slack Webhook URLs for notifications. Support channel will be used for direct user contact.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="slack-webhook-url">Build/Publish Webhook URL</Label>
              <Input
                id="slack-webhook-url"
                type="password"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-webhook-url">Support Channel Webhook URL</Label>
              <Input
                id="support-webhook-url"
                type="password"
                value={supportWebhookUrl}
                onChange={(e) => setSupportWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SlackIntegrationCard;
