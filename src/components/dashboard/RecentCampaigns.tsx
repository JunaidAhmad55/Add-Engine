
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { Campaign } from "@/lib/db-types";

interface RecentCampaignsProps {
  campaigns: Campaign[];
  isLoading: boolean;
}

const RecentCampaigns = ({ campaigns, isLoading }: RecentCampaignsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Recent Campaigns
        </CardTitle>
        <CardDescription>Your latest ad campaigns and their performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && [...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => (
          <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{campaign.name}</p>
              <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
              campaign.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {campaign.status}
            </span>
          </div>
        ))}
        {!isLoading && campaigns.length === 0 && (
            <div className="text-center p-4 text-sm text-gray-500">
                No recent campaigns to show.
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentCampaigns;
