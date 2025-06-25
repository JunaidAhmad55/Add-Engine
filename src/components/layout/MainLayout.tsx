import React, { useState, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import AssetLibrary from "@/components/AssetLibrary";
import CampaignsPage from "@/pages/CampaignsPage";
import Dashboard from "@/components/Dashboard";
import UserSettings from "@/components/UserSettings";
import GodModePage from "@/pages/GodModePage";
import GodModeOverlay from "@/components/godmode/GodModeOverlay";
import { UserProfile } from "@/hooks/useUserProfile";
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Lazy imports for managers
const MetaCampaignManager = React.lazy(() => import("@/components/meta/MetaCampaignManager"));
const TiktokCampaignManager = React.lazy(() => import("@/components/tiktok/TiktokCampaignManager"));

interface UserSettingsUser {
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
}

interface MainLayoutProps {
  currentUser: SupabaseUser | null;
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  profileError: Error | null;
  onProfileUpdate: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainLayout = ({
  currentUser,
  userProfile,
  isLoadingProfile,
  profileError,
  onProfileUpdate,
  activeTab,
  onTabChange,
}: MainLayoutProps) => {
  const [campaignsInitialView, setCampaignsInitialView] = useState<'list' | 'builder' | 'detail'>('list');
  const [godModeOverlayOpen, setGodModeOverlayOpen] = useState(false);
  const [selectedAdPlatform, setSelectedAdPlatform] = useState<"meta" | "tiktok">("meta");

  const handleTabValueChange = (tab: string) => {
    onTabChange(tab);
    setCampaignsInitialView('list');
  };

  const handleGoToCampaignBuilder = () => {
    setCampaignsInitialView('builder');
    onTabChange('campaigns');
  };

  const userSettingsData: UserSettingsUser = {
    name: userProfile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email || "Guest User",
    email: currentUser?.email || "no-email@example.com",
    role: userProfile?.account_role || userProfile?.role || (currentUser?.user_metadata?.role as string) || 'guest',
    avatarUrl: userProfile?.avatar_url || null,
  };

  const accountId = userProfile?.account_id || null;
  const userId = currentUser?.id;

  console.log("MainLayout - userProfile:", userProfile, "accountId:", accountId, "userSettingsData:", userSettingsData);

  const renderError = (error: Error) => (
    <div className="text-center p-12">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
        <p className="text-red-800 font-medium">Error loading user data</p>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    </div>
  );

  const renderLoading = (message: string) => (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-3" />
      <span className="text-gray-600">{message}</span>
    </div>
  );

  const renderAccountNotFound = () => (
    <div className="text-center p-12">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-md mx-auto">
        <p className="text-amber-800 font-medium">Account not found</p>
        <p className="text-amber-700 text-sm mt-1">We couldn't find your account details. Please ensure you are part of an account.</p>
      </div>
    </div>
  );

  const renderUserContextNotFound = () => (
    <div className="text-center p-12">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-md mx-auto">
        <p className="text-amber-800 font-medium">User context not found</p>
        <p className="text-amber-700 text-sm mt-1">Asset Library requires user authentication. This is expected in development mode.</p>
      </div>
    </div>
  );

  // NEW: Icon definitions for clarity/consistency with screenshot reference
  const tabIcons = {
    dashboard: (
      // L-shaped dashboard icon, now bolder
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      </svg>
    ),
    assets: (
      // Briefcase icon
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="#284D8B" strokeWidth="2" fill="none"/>
        <rect x="7" y="3" width="10" height="4" rx="1" stroke="#284D8B" strokeWidth="2" fill="none"/>
      </svg>
    ),
    campaigns: (
      // Plus icon for campaigns
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M12 3v18m9-9H3" stroke="#355AB3" strokeWidth="2.3" fill="none"/>
      </svg>
    ),
    adintegrations: (
      // Lightning bolt for ad integrations
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8L21 10h-8l1-8z" stroke="#059669" strokeWidth="1.7" fill="none"/>
      </svg>
    ),
    godmode: (
      // Plus icon for God Mode, green
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M12 2v20M2 12h20" stroke="#27B43E" strokeWidth="2.3" fill="none"/>
      </svg>
    ),
    settings: (
      // Clock-circle icon for settings (like reference image)
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#222934" strokeWidth="2" fill="none"/>
        <path d="M12 7v5l3 2" stroke="#222934" strokeWidth="2" fill="none"/>
      </svg>
    ),
  };

  return (
    <main className="w-full min-h-screen bg-[#f6f8fa] pb-10">
      <div className="max-w-full px-0 py-6">
        <div className="rounded-[22px] bg-[#F8FAFB] shadow-sm border border-gray-100 px-0 py-6 md:py-7 max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabValueChange} className="space-y-8">
            {/* UPDATED TABS MENU */}
            <TabsList className="w-full flex flex-row flex-nowrap gap-0 bg-[#f6f8fa] px-0 py-0 mb-7 rounded-[32px] border border-gray-200 shadow-inner"
              style={{
                boxShadow: "0 1px 8px 0 rgba(34,41,52,0.03)",
                minHeight: "64px",
                overflowX: "auto",
                alignItems: "center"
              }}
            >
              {/* Each tab: custom styling for pill effect, etc */}
              {[
                { key: "dashboard", label: "Dashboard" },
                { key: "assets", label: "Assets" },
                { key: "campaigns", label: "Campaigns" },
                { key: "adintegrations", label: "Ad Integrations" }, // NEW TAB
                { key: "godmode", label: "God Mode" },
                { key: "settings", label: "Settings" },
              ].map(tab => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className={`
                    flex flex-row items-center gap-2 px-8 py-3
                    rounded-[20px] text-base font-semibold mx-1 min-w-[150px] justify-center
                    transition-all
                    ${
                      activeTab === tab.key
                        ? "bg-[#20B153] text-white shadow font-bold"
                        : "bg-transparent text-[#678]"
                    }
                    group
                  `}
                  style={{
                    boxShadow: activeTab === tab.key ? "0 2px 12px 0 rgba(40,177,83,0.10)" : "none"
                  }}
                >
                  <span className={activeTab === tab.key
                    ? "text-white" 
                    : [
                        tab.key === "assets" ? "text-[#284D8B]" : "",
                        tab.key === "campaigns" ? "text-[#355AB3]" : "",
                        tab.key === "adintegrations" ? "text-emerald-700" : "",
                        tab.key === "godmode" ? "text-[#27B43E]" : "",
                        tab.key === "settings" ? "text-[#222934]" : "",
                        "text-[#222934]",
                      ].join(" ")
                  }>
                    {/* Use a lightning bolt for 'Ad Integrations' */}
                    {tab.key === "adintegrations" ? <span><svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8L21 10h-8l1-8z" stroke="#059669" strokeWidth="1.7" fill="none"/></svg></span>
                      : tabIcons[tab.key as keyof typeof tabIcons]
                    }
                  </span>
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Panels */}
            <TabsContent value="dashboard">
              {isLoadingProfile && currentUser ? renderLoading("Loading Dashboard...") : profileError ? renderError(profileError) : accountId ? <Dashboard orgId={accountId} onGoToCampaignBuilder={handleGoToCampaignBuilder} /> : renderAccountNotFound()}
            </TabsContent>
            <TabsContent value="assets">
              {isLoadingProfile && currentUser ? renderLoading("Loading user data...") : profileError ? renderError(profileError) : (accountId && userId) ? <AssetLibrary orgId={accountId} userId={userId} /> : renderUserContextNotFound()}
            </TabsContent>
            <TabsContent value="campaigns">
              {isLoadingProfile && currentUser ? renderLoading("Loading...") : profileError ? renderError(profileError) : accountId ? <CampaignsPage orgId={accountId} initialView={campaignsInitialView} /> : renderAccountNotFound()}
            </TabsContent>
            
            {/* AD INTEGRATIONS TAB */}
            <TabsContent value="adintegrations">
              <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
                <button
                  className={`
                    flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-xl transition
                    ${selectedAdPlatform === "meta"
                      ? "border-blue-600 bg-blue-50 shadow"
                      : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"}
                  `}
                  onClick={() => setSelectedAdPlatform("meta")}
                  aria-label="Manage Meta Ads"
                >
                  <span className="mb-2">
                    <svg className="w-7 h-7" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#1877F3"/><path d="M18.92 29V17.21h3.75l.56-4H18.92V11.42c0-1.16.35-1.95 2.16-1.95h2.3V6.09c-.4-.05-1.8-.18-3.42-.18-3.38 0-5.7 2-5.7 5.65v3.16H8.25v4h3.01V29h5.67z" fill="#fff"/></svg>
                  </span>
                  <span className="text-lg font-semibold">Meta Ads Manager</span>
                </button>
                <button
                  className={`
                    flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-xl transition
                    ${selectedAdPlatform === "tiktok"
                      ? "border-black bg-gray-50 shadow"
                      : "border-gray-200 hover:border-black hover:bg-gray-50/60"}
                  `}
                  onClick={() => setSelectedAdPlatform("tiktok")}
                  aria-label="Manage TikTok Ads"
                >
                  <span className="mb-2">
                    <svg className="w-7 h-7" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#000"/><path d="M21.14 9.97a3.93 3.93 0 0 0 1.61-.35c.08 1.93 1.62 3.5 3.57 3.65v3.08a6.67 6.67 0 0 1-5.53-2.8v8.64a6.26 6.26 0 1 1-6.28-6.26c.25 0 .5.02.75.05v3.12a3.13 3.13 0 1 0 2.1 2.96v-14h3.78c.04.02.07.05.1.07v2.9z" fill="#25F4EE"/><path d="M21.14 11.55v8.67A6.26 6.26 0 1 1 15.3 14c.25 0 .5.02.75.05v3.12a3.13 3.13 0 1 0 2.1 2.96v-13.97h3.78c.05.02.1.06.1.07v5.32c0 .86-.7 1.56-1.57 1.56z" fill="#fff"/></svg>
                  </span>
                  <span className="text-lg font-semibold">TikTok Ads Manager</span>
                </button>
              </div>
              <div className="mt-6">
                {selectedAdPlatform === "meta" ? (
                  <div className="shadow rounded-xl border">
                    {isLoadingProfile && currentUser ? renderLoading("Loading Meta Ads...") :
                      MetaCampaignManager && (
                        <Suspense fallback={renderLoading("Loading Meta Ads Manager...")}>
                          <div className="p-4"><MetaCampaignManager /></div>
                        </Suspense>
                      )
                    }
                  </div>
                ) : (
                  <div className="shadow rounded-xl border">
                    {isLoadingProfile && currentUser ? renderLoading("Loading TikTok Ads...") :
                      TiktokCampaignManager && (
                        <Suspense fallback={renderLoading("Loading TikTok Ads Manager...")}>
                          <div className="p-4"><TiktokCampaignManager /></div>
                        </Suspense>
                      )
                    }
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="godmode">
              <GodModePage />
            </TabsContent>
            <TabsContent value="settings">
              {isLoadingProfile && currentUser
                ? renderLoading("Loading settings...")
                : <UserSettings 
                    user={userSettingsData} 
                    userProfile={userProfile}
                    onProfileUpdate={onProfileUpdate} 
                  />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* God Mode quick button and overlay */}
      <div className="fixed bottom-5 right-8 z-40">
        <button
          aria-label="Open God Mode"
          onClick={() => setGodModeOverlayOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-700 text-white text-lg font-bold hover:scale-105 transition-all"
        >
          <svg className="h-5 w-5 text-green-200" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" fill="none"/></svg> God Mode
        </button>
      </div>
      <GodModeOverlay
        open={godModeOverlayOpen}
        onClose={() => setGodModeOverlayOpen(false)}
      />
    </main>
  );
};

export default MainLayout;
