
import { Button } from "@/components/ui/button";
import { Youtube, CheckCircle } from "lucide-react";

interface Props {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
}

const TiktokIntegrationCard = ({ isConnected, isConnecting, onConnect }: Props) => (
  <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-gray-100">
        <Youtube className="h-6 w-6 text-black" />
      </div>
      <div>
        <p className="font-medium">TikTok Ads</p>
        <p className="text-sm text-gray-500">Connect your TikTok ad account</p>
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      onClick={onConnect}
      disabled={isConnecting || isConnected}
    >
      {isConnected
        ? (<><CheckCircle className="mr-1.5 h-4 w-4 text-green-600 inline-block" />Connected</>)
        : isConnecting
          ? "Connecting..."
          : "Connect"}
    </Button>
  </div>
);

export default TiktokIntegrationCard;
