// Meta Ads API service mock

export interface MetaAccessToken {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
}

export interface MetaError {
  message: string;
  type: string;
  code: number;
  fbtrace_id: string;
}

export interface MetaPaging {
  cursors: {
    before: string;
    after: string;
  };
  next?: string;
  previous?: string;
}

export interface MetaResponse<T> {
  data: T[];
  paging?: MetaPaging;
  error?: MetaError;
}

export interface MetaCampaign {
  id: string;
  account_id: string;
  name: string;
  objective: string; // e.g., 'LINK_CLICKS', 'CONVERSIONS', 'POST_ENGAGEMENT'
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
  special_ad_categories: string[]; // e.g., ['NONE'] or ['HOUSING']
  buying_type?: string; // e.g., 'AUCTION'
  daily_budget?: number;
  lifetime_budget?: number;
  created_time?: string;
  // Potentially add more fields relevant to a campaign template
}

export interface MetaCampaignData {
  name: string;
  objective: string; // e.g., 'LINK_CLICKS', 'CONVERSIONS', 'POST_ENGAGEMENT'
  status: 'ACTIVE' | 'PAUSED';
  special_ad_categories?: string[]; // e.g., ['NONE'] or ['HOUSING']
  buying_type?: string; // e.g., 'AUCTION'
  daily_budget?: number;
  lifetime_budget?: number;
  // Add other fields as needed for creation
}

// NEW: Detailed Targeting Interface
export interface MetaTargeting {
  age_min?: number;
  age_max?: number;
  genders?: number[]; // 1 for Male, 2 for Female
  geo_locations?: {
    countries?: string[]; // ISO 3166-1 alpha-2 country codes
    regions?: { key: string }[]; // e.g., { key: "3847" } for California
    cities?: { key: string; radius: number; distance_unit: 'kilometer' | 'mile' }[];
  };
  interests?: { id: string; name: string }[]; // Facebook interest IDs
  custom_audiences?: { id: string; name: string }[];
  lookalike_audiences?: { id: string; name: string }[];
  // Add more specific targeting fields as needed
  // e.g., behaviors, connections, flexible_spec, exclusions
  publisher_platforms?: ('facebook' | 'instagram' | 'audience_network' | 'messenger')[];
  facebook_positions?: ('feed' | 'instant_article' | 'instream_video' | 'marketplace' | 'story' | 'search' | 'reels')[];
  instagram_positions?: ('stream' | 'story' | 'reels' | 'explore' | 'ig_search')[];
  // ... other platform specific placements
}

export interface MetaAdSet {
  id: string;
  account_id: string;
  campaign_id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
  billing_event?: 'IMPRESSIONS' | 'LINK_CLICKS' | 'APP_INSTALLS';
  optimization_goal?: 'REACH' | 'IMPRESSIONS' | 'LINK_CLICKS' | 'OFFSITE_CONVERSIONS';
  bid_amount?: number;
  daily_budget?: number;
  lifetime_budget?: number;
  start_time?: string; // ISO 8601 format
  end_time?: string;   // ISO 8601 format
  targeting?: MetaTargeting; // Using the new detailed interface
  promoted_object?: {
    pixel_id?: string;
    custom_event_type?: string; // e.g., 'PURCHASE', 'LEAD'
    // other promoted object types like page_id, application_id, etc.
  };
  created_time?: string;
  // Add other fields relevant to an ad set template
}

export interface MetaAdSetData {
  name: string;
  campaign_id: string;
  status: 'ACTIVE' | 'PAUSED';
  billing_event?: 'IMPRESSIONS' | 'LINK_CLICKS' | 'APP_INSTALLS';
  optimization_goal?: 'REACH' | 'IMPRESSIONS' | 'LINK_CLICKS' | 'OFFSITE_CONVERSIONS';
  bid_amount?: number;
  daily_budget?: number;
  lifetime_budget?: number;
  start_time?: string;
  end_time?: string;
  targeting?: MetaTargeting; // Using the new detailed interface
  promoted_object?: {
    pixel_id?: string;
    custom_event_type?: string;
  };
  // Add other fields as needed for creation
}

// NEW: Detailed Creative Interface (example structure)
export interface MetaAdCreativeObjectStorySpec {
  page_id?: string;
  instagram_actor_id?: string;
  link_data?: {
    link: string;
    message?: string;
    name?: string; // headline
    caption?: string; // link description
    description?: string; // body / primary text
    image_hash?: string;
    call_to_action?: { type: string; value?: { link: string } }; // e.g., { type: 'LEARN_MORE' }
    // For video
    video_id?: string;
    image_url?: string; // thumbnail for video
  };
  // Add other specs for different ad formats like carousel
}

export interface MetaAdCreative {
  id?: string; // May not exist until ad is created, but useful for GET responses
  name?: string;
  object_story_spec?: MetaAdCreativeObjectStorySpec;
  image_hash?: string;
  image_url?: string;
  video_id?: string;
  // Add other creative elements like asset_feed_spec for dynamic creative
  // actor_id (page id), object_id (page post id if using existing post)
}

export interface MetaAd {
  id: string;
  account_id: string;
  adset_id: string;
  campaign_id: string; // Often returned by API
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED' | 'PENDING_REVIEW' | 'DISAPPROVED';
  creative?: MetaAdCreative; // Using the new detailed interface
  tracking_specs?: any; // Define more specifically if needed
  created_time?: string;
  // Add other fields relevant to an ad
}

export interface MetaAdData {
  name: string;
  adset_id: string;
  status: 'ACTIVE' | 'PAUSED';
  creative: MetaAdCreative; // Using the new detailed interface
  tracking_specs?: any;
  // Add other fields as needed for creation
}

export interface MetaPerformanceMetrics {
  impressions: number;
  clicks: number;
  cost_per_click: number;
  reach: number;
  spend: number;
  // Add other relevant metrics
}

class MetaAdsService {
  private accessToken: string | null = null;
  private mockMetaAccountId = '1234567890'; // Mock account ID
  private mockMetaCampaigns: MetaCampaign[] = [];
  private mockMetaAdSets: MetaAdSet[] = [];
  private mockMetaAds: MetaAd[] = [];

  constructor() {
    // Load stored token from localStorage
    this.accessToken = this.getStoredToken();
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('meta_access_token', token);
  }

  getStoredToken() {
    return localStorage.getItem('meta_access_token');
  }

  isConnected(): boolean {
    return !!this.accessToken;
  }

  async connectToMeta(mockToken = `meta_token_${Date.now()}`): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate OAuth process
      console.log('Starting Meta OAuth flow...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.setAccessToken(mockToken);
      return { success: true };
    } catch (error) {
      console.error('Meta auth error:', error);
      return { success: false, error: 'Failed to authenticate with Meta' };
    }
  }

  async getCampaigns(): Promise<{ success: boolean; campaigns?: MetaCampaign[]; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Meta Ads' };
    }

    try {
      // Mock API call
      console.log('Fetching Meta campaigns...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock campaign data
      return { success: true, campaigns: this.mockMetaCampaigns };
    } catch (error) {
      console.error('Meta API error:', error);
      return { success: false, error: 'Failed to fetch campaigns' };
    }
  }

  async createCampaign(campaignData: MetaCampaignData): Promise<{ success: boolean; campaign?: MetaCampaign; error?: string }> {
    if (!this.isConnected()) return { success: false, error: 'Meta Ads not connected' };
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCampaign: MetaCampaign = {
      id: `camp_${Date.now()}`,
      account_id: this.mockMetaAccountId,
      name: campaignData.name,
      objective: campaignData.objective,
      status: campaignData.status,
      special_ad_categories: campaignData.special_ad_categories || ['NONE'],
      buying_type: campaignData.buying_type || 'AUCTION',
      daily_budget: campaignData.daily_budget,
      lifetime_budget: campaignData.lifetime_budget,
      created_time: new Date().toISOString(),
    };
    this.mockMetaCampaigns.push(newCampaign);
    console.log('Created Meta Campaign:', newCampaign);
    return { success: true, campaign: newCampaign };
  }

  async updateMetaCampaign(campaignId: string, updates: Partial<MetaCampaignData>): Promise<{ success: boolean; campaign?: MetaCampaign; error?: string }> {
    if (!this.isConnected()) return { success: false, error: 'Meta Ads not connected' };

    const campaignIndex = this.mockMetaCampaigns.findIndex(c => c.id === campaignId);
    if (campaignIndex === -1) {
      return { success: false, error: 'Campaign not found' };
    }

    // Update the campaign with the provided data
    this.mockMetaCampaigns[campaignIndex] = {
      ...this.mockMetaCampaigns[campaignIndex],
      ...updates,
    };

    return { success: true, campaign: this.mockMetaCampaigns[campaignIndex] };
  }

  async getAdSets(campaignId: string): Promise<{ success: boolean; adSets?: MetaAdSet[]; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Meta Ads' };
    }

    try {
      // Mock API call
      console.log(`Fetching Meta ad sets for campaign ${campaignId}...`);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock ad set data
      const adSets = this.mockMetaAdSets.filter(adSet => adSet.campaign_id === campaignId);
      return { success: true, adSets };
    } catch (error) {
      console.error('Meta API error:', error);
      return { success: false, error: 'Failed to fetch ad sets' };
    }
  }

  async createAdSet(adSetData: MetaAdSetData): Promise<{ success: boolean; adSet?: MetaAdSet; error?: string }> {
    if (!this.isConnected()) return { success: false, error: 'Meta Ads not connected' };
    await new Promise(resolve => setTimeout(resolve, 500));

    const newAdSet: MetaAdSet = {
      id: `adset_${Date.now()}`,
      account_id: this.mockMetaAccountId,
      campaign_id: adSetData.campaign_id,
      name: adSetData.name,
      status: adSetData.status,
      billing_event: adSetData.billing_event || 'IMPRESSIONS',
      optimization_goal: adSetData.optimization_goal || 'REACH',
      bid_amount: adSetData.bid_amount,
      daily_budget: adSetData.daily_budget,
      lifetime_budget: adSetData.lifetime_budget,
      start_time: adSetData.start_time || new Date().toISOString(),
      end_time: adSetData.end_time,
      targeting: adSetData.targeting || {}, // Default to empty object if not provided
      promoted_object: adSetData.promoted_object,
      created_time: new Date().toISOString(),
    };
    this.mockMetaAdSets.push(newAdSet);
    console.log('Created Meta Ad Set:', newAdSet);
    return { success: true, adSet: newAdSet };
  }

  async getAds(adSetId: string): Promise<{ success: boolean; ads?: MetaAd[]; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Meta Ads' };
    }

    try {
      // Mock API call
      console.log(`Fetching Meta ads for ad set ${adSetId}...`);
      await new Promise(resolve => setTimeout(resolve, 700));

      // Mock ad data
      const ads = this.mockMetaAds.filter(ad => ad.adset_id === adSetId);
      return { success: true, ads };
    } catch (error) {
      console.error('Meta API error:', error);
      return { success: false, error: 'Failed to fetch ads' };
    }
  }

  async createAd(adData: MetaAdData): Promise<{ success: boolean; ad?: MetaAd; error?: string }> {
    if (!this.isConnected()) return { success: false, error: 'Meta Ads not connected' };
    await new Promise(resolve => setTimeout(resolve, 500));

    // For mock, we'll assume the creative object_story_spec might reference uploaded assets indirectly
    // In a real scenario, creative creation is more complex (e.g., uploading assets to Meta first)
    const creativeId = `creative_${Date.now()}`;
    const newAd: MetaAd = {
      id: `ad_${Date.now()}`,
      account_id: this.mockMetaAccountId,
      adset_id: adData.adset_id,
      campaign_id: this.mockMetaAdSets.find(as => as.id === adData.adset_id)?.campaign_id || 'unknown_campaign_id', // Fetch campaign_id
      name: adData.name,
      status: adData.status, // Can be 'PENDING_REVIEW' initially
      creative: { // Ensure this matches MetaAdCreative
        id: creativeId, // Assign an ID to the creative part
        name: adData.creative.name || `${adData.name} Creative`,
        object_story_spec: adData.creative.object_story_spec,
        image_hash: adData.creative.image_hash,
        video_id: adData.creative.video_id,
      },
      tracking_specs: adData.tracking_specs,
      created_time: new Date().toISOString(),
    };
    this.mockMetaAds.push(newAd);
    console.log('Created Meta Ad:', newAd);
    return { success: true, ad: newAd };
  }

  async bulkCreateAds(adsData: MetaAdData[]): Promise<{ success: boolean; results: { ad?: MetaAd; error?: string }[]; error?: string }> {
    if (!this.isConnected()) return { success: false, error: 'Meta Ads not connected', results: [] }; // Added results: [] here
    
    const results: { ad?: MetaAd; error?: string }[] = [];
    let successCount = 0;

    for (const adData of adsData) {
      // Simulate individual ad creation delay
      await new Promise(resolve => setTimeout(resolve, 200)); 
      
      // Basic validation example
      if (!adData.name || !adData.adset_id || !adData.creative) {
        results.push({ error: 'Missing required ad data (name, adset_id, or creative)' });
        continue;
      }

      const campaignIdForAd = this.mockMetaAdSets.find(as => as.id === adData.adset_id)?.campaign_id;
      if (!campaignIdForAd) {
        results.push({ error: `Ad set ${adData.adset_id} not found or has no campaign_id` });
        continue;
      }

      const creativeId = `creative_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const newAd: MetaAd = {
        id: `ad_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        account_id: this.mockMetaAccountId,
        adset_id: adData.adset_id,
        campaign_id: campaignIdForAd,
        name: adData.name,
        status: adData.status,
        creative: {
          id: creativeId,
          name: adData.creative.name || `${adData.name} Creative`,
          object_story_spec: adData.creative.object_story_spec,
          image_hash: adData.creative.image_hash,
          video_id: adData.creative.video_id,
        },
        tracking_specs: adData.tracking_specs,
        created_time: new Date().toISOString(),
      };
      this.mockMetaAds.push(newAd);
      results.push({ ad: newAd });
      successCount++;
    }
    
    console.log('Bulk Ads Creation Results:', results);
    return { 
      success: successCount > 0, 
      results,
      // If all ads failed, we might want to provide a general error message
      // but the individual results array already contains specific errors.
      // So, the top-level 'error' might only be for global issues like 'not connected'.
      error: successCount === 0 && adsData.length > 0 ? 'All ads in the bulk request failed to create' : undefined
    };
  }

  async getCampaignMetrics(campaignId: string): Promise<{ success: boolean; metrics?: MetaPerformanceMetrics; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Meta Ads' };
    }

    try {
      console.log(`Fetching campaign metrics for campaign ${campaignId}...`);
      await new Promise(resolve => setTimeout(resolve, 700));

      // Mock metrics data
      const metrics: MetaPerformanceMetrics = {
        impressions: Math.floor(Math.random() * 10000),
        clicks: Math.floor(Math.random() * 500),
        cost_per_click: parseFloat((Math.random() * 2).toFixed(2)),
        reach: Math.floor(Math.random() * 5000),
        spend: parseFloat((Math.random() * 50).toFixed(2))
      };
      return { success: true, metrics };
    } catch (error) {
      console.error('Meta API error:', error);
      return { success: false, error: 'Failed to fetch campaign metrics' };
    }
  }

  async getAdMetrics(adId: string): Promise<{ success: boolean; metrics?: MetaPerformanceMetrics; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Meta Ads' };
    }

    try {
      console.log(`Fetching ad metrics for ad ${adId}...`);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Mock metrics data
      const metrics: MetaPerformanceMetrics = {
        impressions: Math.floor(Math.random() * 2000),
        clicks: Math.floor(Math.random() * 100),
        cost_per_click: parseFloat((Math.random() * 1.5).toFixed(2)),
        reach: Math.floor(Math.random() * 1000),
        spend: parseFloat((Math.random() * 10).toFixed(2))
      };
      return { success: true, metrics };
    } catch (error) {
      console.error('Meta API error:', error);
      return { success: false, error: 'Failed to fetch ad metrics' };
    }
  }
}

export const metaAdsService = new MetaAdsService();
