
import { useState, useCallback } from "react";

// Mock TikTok Ads service API (replace with real API in the future)
const mockCampaigns = [
  {
    id: "camp-1",
    name: "Spring Promo",
    objective: "TRAFFIC",
    status: "ACTIVE",
  },
];
const mockAdGroups = [
  {
    id: "ag-1",
    campaign_id: "camp-1",
    name: "Youth Targeted",
    status: "ACTIVE",
    targeting_countries: ["US", "CA"],
    daily_budget: 100,
  },
];
const mockAds = [
  {
    id: "ad-1",
    ad_group_id: "ag-1",
    name: "Cool Video Ad",
    status: "ACTIVE",
    video_url: "https://www.example.com/cool.mp4",
    headline: "Get it now!",
    description: "Join our promo event.",
  },
];

export function useTiktokCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>(mockCampaigns);
  const [adGroups, setAdGroups] = useState<any[]>(mockAdGroups);
  const [ads, setAds] = useState<any[]>(mockAds);

  // Mock loading
  const [loading, setLoading] = useState(false);
  const [adGroupsLoading, setAdGroupsLoading] = useState(false);
  const [adsLoading, setAdsLoading] = useState(false);

  // Campaigns
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      setCampaigns([...mockCampaigns]);
      setLoading(false);
    }, 500);
  }, []);

  const createCampaign = useCallback(async (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setCampaigns(prev => [...prev, { ...data, id: Math.random().toString(36).slice(2) }]);
      setLoading(false);
    }, 400);
  }, []);

  const updateCampaign = useCallback(async (id: string, updates: any) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCampaign = useCallback(async (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    setAdGroups(prev => prev.filter(a => a.campaign_id !== id));
    setAds(prev => prev.filter(ad => !adGroups.some(a => a.campaign_id === id && ad.ad_group_id === a.id)));
  }, [adGroups]);

  // Ad Groups
  const fetchAdGroups = useCallback(async (campaignId: string) => {
    setAdGroupsLoading(true);
    setTimeout(() => {
      setAdGroups(mockAdGroups.filter(a => a.campaign_id === campaignId));
      setAdGroupsLoading(false);
    }, 500);
  }, []);

  const createAdGroup = useCallback(async (data: any) => {
    setAdGroups(prev => [...prev, { ...data, id: Math.random().toString(36).slice(2) }]);
  }, []);

  const updateAdGroup = useCallback(async (id: string, updates: any) => {
    setAdGroups(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteAdGroup = useCallback(async (id: string) => {
    setAdGroups(prev => prev.filter(a => a.id !== id));
    setAds(prev => prev.filter(ad => ad.ad_group_id !== id));
  }, []);

  // Ads
  const fetchAds = useCallback(async (adGroupId: string) => {
    setAdsLoading(true);
    setTimeout(() => {
      setAds(mockAds.filter(a => a.ad_group_id === adGroupId));
      setAdsLoading(false);
    }, 500);
  }, []);

  const createAd = useCallback(async (data: any) => {
    setAds(prev => [...prev, { ...data, id: Math.random().toString(36).slice(2) }]);
  }, []);

  const updateAd = useCallback(async (id: string, updates: any) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteAd = useCallback(async (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
  }, []);

  return {
    campaigns, fetchCampaigns, createCampaign, updateCampaign, deleteCampaign, loading,
    adGroups, fetchAdGroups, createAdGroup, updateAdGroup, deleteAdGroup, adGroupsLoading,
    ads, fetchAds, createAd, updateAd, deleteAd, adsLoading,
  };
}
