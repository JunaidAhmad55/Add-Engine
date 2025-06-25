
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Link, Users, Cpu } from "lucide-react";

import SettingsHeader from "./settings/SettingsHeader";
import ProfileTab from "./settings/ProfileTab";
import IntegrationsTab from "./settings/IntegrationsTab";
import TeamTab from "./settings/TeamTab";
import SecurityTab from "./settings/SecurityTab";
import AITab from "./settings/AITab";
import { UserProfile } from "@/hooks/useUserProfile";

interface UserSettingsProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
  userProfile: UserProfile | null;
  onProfileUpdate: () => void;
}

const ALLOWED_ROLES = ["user", "admin", "buyer", "creator", "moderator"] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

const UserSettings = ({ user, userProfile, onProfileUpdate }: UserSettingsProps) => {
  // Type safely map or fallback the role
  const getAllowedRole = (role: string): AllowedRole => {
    return (ALLOWED_ROLES.includes(role as AllowedRole) ? role : "user") as AllowedRole;
  };

  // Compose user for TeamTab and others needing strict role
  const teamTabUser = {
    role: getAllowedRole(user.role),
    email: user.email,
    account_id: userProfile?.account_id,
    team_id: userProfile?.team_id,
  };

  // Use account_id (org id) for AI tab - this is the key fix
  const orgId = userProfile?.account_id || userProfile?.team_id || null;
  const isAdmin = user.role === "admin" || userProfile?.account_role === "admin";

  console.log("UserSettings - orgId:", orgId, "userProfile:", userProfile, "isAdmin:", isAdmin);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SettingsHeader />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-600" />
            AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab user={user} onProfileUpdate={onProfileUpdate} />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamTab user={teamTabUser} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          {orgId ? (
            <AITab orgId={orgId} isAdmin={isAdmin} />
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-2">Your organization could not be found.</p>
              <p className="text-xs text-gray-400">
                Debug info: account_id={userProfile?.account_id}, team_id={userProfile?.team_id}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
