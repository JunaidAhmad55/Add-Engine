import React from "react";
import { BarChart3, TrendingUp, Zap, Image } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/database";
import { formatDistanceToNow } from 'date-fns';
import { fileUploadService } from "@/lib/file-upload";

import WelcomeHeader from "./dashboard/WelcomeHeader";
import StatsGrid, { type Stat } from "./dashboard/StatsGrid";
import RecentCampaigns from "./dashboard/RecentCampaigns";
import RecentAssets, { type RecentAsset } from "./dashboard/RecentAssets";
import ActivityLog from "./dashboard/ActivityLog";

interface Activity {
  id: string;
  created_at: string;
  action: string;
  details: any;
  user?: {
    full_name?: string | null;
    email?: string | null;
  } | null;
}

interface DashboardProps {
  orgId: string;
  onGoToCampaignBuilder: () => void;
}

const Dashboard = ({ orgId, onGoToCampaignBuilder }: DashboardProps) => {
  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns', orgId],
    queryFn: () => db.getCampaignsByOrg(orgId),
    enabled: !!orgId,
  });

  const { data: assets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['assets', orgId],
    queryFn: () => db.getAssetsByOrg(orgId),
    enabled: !!orgId,
  });
  
  const { data: adVariants, isLoading: isLoadingAdVariants } = useQuery({
      queryKey: ['adVariants', orgId],
      queryFn: () => db.getAdVariantsByOrg(orgId),
      enabled: !!orgId,
  });

  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
      queryKey: ['orgPerformance', orgId],
      queryFn: () => db.getPerformanceByOrg(orgId),
      enabled: !!orgId,
  });

  const { data: activityLog, isLoading: isLoadingActivity } = useQuery<Activity[]>({
    queryKey: ['activityLog', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("activity_log")
        .select(`
          id,
          created_at,
          action,
          details,
          user:profiles (
            full_name,
            email
          )
        `)
        .eq('team_id', orgId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching activity log:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!orgId,
  });

  const isLoading = isLoadingCampaigns || isLoadingAssets || isLoadingAdVariants || isLoadingPerformance;

  const activeCampaignsCount = campaigns?.filter(c => c.status === 'active').length || 0;
  const totalAssetsCount = assets?.length || 0;
  const totalAdsLaunchedCount = adVariants?.length || 0;

  const { totalClicks, totalConversions } = React.useMemo(() => {
    if (!performanceData) return { totalClicks: 0, totalConversions: 0 };
    return performanceData.reduce((acc, p) => {
        acc.totalClicks += p.clicks;
        acc.totalConversions += p.conversions;
        return acc;
    }, { totalClicks: 0, totalConversions: 0 });
  }, [performanceData]);

  const successRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  const stats: Stat[] = [
    { name: "Active Campaigns", value: activeCampaignsCount, icon: BarChart3, color: "text-blue-600" },
    { name: "Total Assets", value: totalAssetsCount, icon: Image, color: "text-green-600" },
    { name: "Ads Launched", value: totalAdsLaunchedCount, icon: Zap, color: "text-purple-600" },
    { name: "Success Rate", value: `${successRate.toFixed(1)}%`, icon: TrendingUp, color: "text-emerald-600" }
  ];

  const recentCampaigns = campaigns
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4) || [];
  
  const recentAssets: RecentAsset[] = assets
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
    .map(asset => ({
        name: asset.filename,
        type: fileUploadService.getFileType(asset.filename),
        size: asset.size_bytes ? `${(asset.size_bytes / 1024 / 1024).toFixed(2)} MB` : "N/A",
        date: formatDistanceToNow(new Date(asset.created_at), { addSuffix: true })
    })) || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader onGoToCampaignBuilder={onGoToCampaignBuilder} />
      <StatsGrid stats={stats} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCampaigns campaigns={recentCampaigns} isLoading={isLoading} />
        <RecentAssets assets={recentAssets} isLoading={isLoading} />
      </div>
      <ActivityLog logs={activityLog || []} loading={isLoadingActivity} />
    </div>
  );
};

export default Dashboard;
