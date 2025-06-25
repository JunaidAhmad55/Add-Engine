
import { useState, useCallback } from "react";
import { metaAdsService } from "@/lib/meta-api";

export function useMetaCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [adSets, setAdSets] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adSetsLoading, setAdSetsLoading] = useState(false);
  const [adsLoading, setAdsLoading] = useState(false);

  // Campaigns
  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    const res = await metaAdsService.getCampaigns();
    setIsLoading(false);
    if (res.success && res.campaigns) setCampaigns(res.campaigns);
    else setCampaigns([]);
  }, []);

  const createCampaign = useCallback(async (data: any) => {
    await metaAdsService.createCampaign(data);
    fetchCampaigns();
  }, [fetchCampaigns]);

  const updateCampaign = useCallback(async (id: string, updates: any) => {
    await metaAdsService.updateMetaCampaign(id, updates);
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Ad Sets
  const fetchAdSets = useCallback(async (campaignId: string) => {
    setAdSetsLoading(true);
    const res = await metaAdsService.getAdSets(campaignId);
    setAdSetsLoading(false);
    if (res.success && res.adSets) setAdSets(res.adSets);
    else setAdSets([]);
  }, []);

  const createAdSet = useCallback(async (data: any) => {
    await metaAdsService.createAdSet(data);
    if (data.campaign_id) fetchAdSets(data.campaign_id);
  }, [fetchAdSets]);

  const updateAdSet = useCallback(async (id: string, updates: any) => {
    // Need to know the parent campaign id to refresh
    const adSet = adSets.find((a: any) => a.id === id);
    await metaAdsService.createAdSet({ ...adSet, ...updates }); // mock update method
    if (adSet?.campaign_id) fetchAdSets(adSet.campaign_id);
  }, [adSets, fetchAdSets]);

  // Ads
  const fetchAds = useCallback(async (adSetId: string) => {
    setAdsLoading(true);
    const res = await metaAdsService.getAds(adSetId);
    setAdsLoading(false);
    if (res.success && res.ads) setAds(res.ads);
    else setAds([]);
  }, []);

  const createAd = useCallback(async (data: any) => {
    await metaAdsService.createAd(data);
    if (data.adset_id) fetchAds(data.adset_id);
  }, [fetchAds]);

  const updateAd = useCallback(async (id: string, updates: any) => {
    const ad = ads.find((a: any) => a.id === id);
    await metaAdsService.createAd({ ...ad, ...updates }); // mock update
    if (ad?.adset_id) fetchAds(ad.adset_id);
  }, [ads, fetchAds]);

  return {
    campaigns, fetchCampaigns, createCampaign, updateCampaign, isLoading,
    adSets, fetchAdSets, createAdSet, updateAdSet, adSetsLoading,
    ads, fetchAds, createAd, updateAd, adsLoading,
  };
}
