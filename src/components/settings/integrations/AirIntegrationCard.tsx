
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers, CheckCircle } from "lucide-react";

interface Props {
  isConnected: boolean;
  onConnect: (apiKey: string) => void;
  isAirConnecting: boolean;
}

const AirIntegrationCard = ({ isConnected, onConnect, isAirConnecting }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  function handleConnect() {
    onConnect(apiKey);
    setApiKey('');
    setDialogOpen(false);
  }

  return (
    <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-gray-100">
          <Layers className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <p className="font-medium">AIR</p>
          <p className="text-sm text-gray-500">Creative collaboration tool</p>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isConnected}
          >
            {isConnected
              ? (<><CheckCircle className="mr-1.5 h-4 w-4 text-green-600 inline-block" />Connected</>)
              : "Connect"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect to AIR</DialogTitle>
            <DialogDescription>
              Enter your AIR API Key to connect your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="air-api-key">API Key</Label>
              <Input
                id="air-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API Key"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConnect} disabled={isAirConnecting}>
              {isAirConnecting ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AirIntegrationCard;
