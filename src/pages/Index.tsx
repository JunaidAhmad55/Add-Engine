
import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import Header from "@/components/layout/Header";
import MainLayout from "@/components/layout/MainLayout";
import Footer from "@/components/layout/Footer";
import type { UserProfile } from "@/hooks/useUserProfile";

interface IndexProps {
  onLogout: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { currentUser, userProfile, isLoadingProfile, profileError, refetchUserProfile } = useUserProfile();

  const handleLogout = () => {
    onLogout();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const userData = {
    name: userProfile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email || "Guest User",
    role: userProfile?.role || (currentUser?.user_metadata?.role as string) || 'guest',
    avatarUrl: userProfile?.avatar_url || null,
  };

  console.log("Index - userData:", userData, "userProfile:", userProfile);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={userData}
        onLogout={handleLogout}
        onSettingsClick={() => handleTabChange("settings")}
      />
      <main className="flex-1">
        <MainLayout
          currentUser={currentUser}
          userProfile={userProfile as UserProfile | null}
          isLoadingProfile={isLoadingProfile}
          profileError={profileError as Error | null}
          onProfileUpdate={refetchUserProfile}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
