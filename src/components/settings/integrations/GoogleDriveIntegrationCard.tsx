
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react"; // Use Cloud icon instead of Drive

interface Props {
  isConnected: boolean;
  isDriveConnecting: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
  expiresIn?: number | null;
}

const GoogleDriveIntegrationCard = ({ isConnected, isDriveConnecting, onConnect, onDisconnect, expiresIn }: Props) => (
  <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-gray-100">
        <Cloud className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <p className="font-medium">Google Drive</p>
        <p className="text-sm text-gray-500">
          Import assets and sync files
          {isConnected && expiresIn ? (
            <span className="ml-2 text-xs text-green-700">
              (Token valid {Math.round(Number(expiresIn) / 3600)}h)
            </span>
          ) : null}
        </p>
      </div>
    </div>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onConnect}
        disabled={isDriveConnecting || isConnected}
      >
        {isConnected
          ? "Connected"
          : isDriveConnecting
            ? "Connecting..."
            : "Connect"}
      </Button>
      {isConnected && !!onDisconnect && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDisconnect}
          className="ml-2"
        >
          Disconnect
        </Button>
      )}
    </div>
  </div>
);

export default GoogleDriveIntegrationCard;
