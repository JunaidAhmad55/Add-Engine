
import { Button } from "@/components/ui/button";
import { Facebook, CheckCircle } from "lucide-react";

interface Props {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
}

const MetaIntegrationCard = ({ isConnected, isConnecting, onConnect }: Props) => (
  <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-gray-100">
        <Facebook className="h-6 w-6 text-blue-700" />
      </div>
      <div>
        <p className="font-medium">Facebook Ads</p>
        <p className="text-sm text-gray-500">Launch and manage campaigns</p>
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

export default MetaIntegrationCard;
