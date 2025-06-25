
// Refactored - AvailableIntegrationsGrid simply renders all platform containers neatly, no business logic here

import GoogleDriveIntegrationContainer from "./GoogleDriveIntegrationContainer";
import SlackIntegrationContainer from "./SlackIntegrationContainer";
import AirIntegrationContainer from "./AirIntegrationContainer";
import MetaIntegrationContainer from "./MetaIntegrationContainer";
import TiktokIntegrationContainer from "./TiktokIntegrationContainer";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface Props {
  teamIntegrations: any[];
  teamId: string | undefined;
  refreshIntegrations: () => void;
}

const AvailableIntegrationsGrid = ({ teamIntegrations, teamId, refreshIntegrations }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Google Docs (placeholder) */}
      <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-gray-100">
            <Mail className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="font-medium">Google Docs</p>
            <p className="text-sm text-gray-500">Import ad copy from documents</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled
        >
          Connect
        </Button>
      </div>
      {/* Slack */}
      <SlackIntegrationContainer refreshIntegrations={refreshIntegrations} />
      {/* AIR */}
      <AirIntegrationContainer refreshIntegrations={refreshIntegrations} />
      {/* Meta Ads */}
      <MetaIntegrationContainer
        teamIntegrations={teamIntegrations}
        teamId={teamId}
        refreshIntegrations={refreshIntegrations}
      />
      {/* Google Drive */}
      <GoogleDriveIntegrationContainer
        teamIntegrations={teamIntegrations}
        teamId={teamId}
        refreshIntegrations={refreshIntegrations}
      />
      {/* TikTok */}
      <TiktokIntegrationContainer
        teamIntegrations={teamIntegrations}
        teamId={teamId}
        refreshIntegrations={refreshIntegrations}
      />
    </div>
  );
};

export default AvailableIntegrationsGrid;

