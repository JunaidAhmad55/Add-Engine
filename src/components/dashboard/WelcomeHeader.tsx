
import React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface WelcomeHeaderProps {
  onGoToCampaignBuilder: () => void;
}

const WelcomeHeader = ({ onGoToCampaignBuilder }: WelcomeHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Welcome back to Engine Ads</h2>
      <p className="text-blue-100 mb-4">Manage your ad campaigns and assets in one powerful platform</p>
      <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" onClick={onGoToCampaignBuilder}>
        <Zap className="h-4 w-4 mr-2" />
        Create New Campaign
      </Button>
    </div>
  );
};

export default WelcomeHeader;
