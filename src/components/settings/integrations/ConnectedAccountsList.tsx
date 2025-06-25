
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectedAccountsListProps {
  teamIntegrations: any[];
  loading: boolean;
}
const getIconAndColor = (platform: string) => {
  switch (platform) {
    case "google_drive":
      return { icon: "Globe", color: "text-blue-600" };
    case "meta_ads":
      return { icon: "Facebook", color: "text-blue-700" };
    case "tiktok_ads":
      return { icon: "Youtube", color: "text-black" };
    case "air":
      return { icon: "Layers", color: "text-indigo-600" };
    case "slack":
      return { icon: "Slack", color: "text-purple-600" };
    default:
      return { icon: "Globe", color: "text-blue-600" }; // fallback
  }
};

// Dynamically import icons to avoid import bloat
import * as LucideIcons from "lucide-react";

const ConnectedAccountsList = ({ teamIntegrations, loading }: ConnectedAccountsListProps) => {
  if (loading) {
    return <div className="text-center text-sm text-muted-foreground p-4">Loading integrations...</div>;
  }

  const accounts = teamIntegrations?.map(acc => {
    const { icon, color } = getIconAndColor(acc.platform);
    const LucideIcon = (LucideIcons as any)[icon];
    return {
      platform: acc.platform,
      icon: LucideIcon,
      color,
      label: acc.account_label || acc.platform,
      status: "connected"
    };
  }) || [];

  if (accounts.length === 0) {
    return <div className="text-center text-sm text-muted-foreground p-4">No platforms connected yet.</div>;
  }

  return (
    <div className="space-y-3">
      {accounts.map(account => (
        <div key={account.platform} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg bg-gray-100`}>
              <account.icon className={`h-6 w-6 ${account.color}`} />
            </div>
            <div>
              <p className="font-medium capitalize">{account.platform.replace("_", " ")}</p>
              <p className="text-sm text-gray-500">
                {account.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectedAccountsList;
