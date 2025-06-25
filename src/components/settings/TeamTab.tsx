
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/lib/auth";
import { db } from "@/lib/database";
import InviteMemberDialog from "./team/InviteMemberDialog";
import TeamMemberList from "./team/TeamMemberList";
import TeamLoadingSkeleton from "./team/TeamLoadingSkeleton";
import TeamErrorState from "./team/TeamErrorState";
import TeamEmptyState from "./team/TeamEmptyState";

interface TeamMember {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "buyer" | "creator" | "user" | "moderator" | null;
  avatar_url: string | null;
}

interface TeamTabProps {
  user: {
    role: "admin" | "buyer" | "creator" | "user" | "moderator";
    account_id?: string | null;
    team_id?: string | null;
    email: string;
  };
}

// Get all members within same account_id
const TeamTab = ({ user }: TeamTabProps) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Must use the correct union as type for inviteRole, not just string! Default "creator"
  const [inviteRole, setInviteRole] = useState<"admin" | "buyer" | "creator" | "user" | "moderator">("creator");
  const [inviteEmail, setInviteEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all profiles where account_id = current user's account_id
  const fetchAccountMembers = async (): Promise<TeamMember[]> => {
    if (!user.account_id) {
      throw new Error("Account ID not found");
    }
    const { data: members, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, avatar_url")
      .eq("account_id", user.account_id);
    if (error) throw error;

    // cast role so it fits strict union
    return (
      members?.map((m: any) => ({
        id: m.id,
        full_name: m.full_name,
        email: m.email,
        role: (m.role ?? null) as "admin" | "buyer" | "creator" | "user" | "moderator" | null,
        avatar_url: m.avatar_url,
      })) || []
    );
  };

  const { data: accountMembers, isLoading, isError, refetch } = useQuery<TeamMember[], Error>({
    queryKey: ["accountMembers", user?.account_id],
    queryFn: fetchAccountMembers,
    enabled: !!user.account_id,
  });

  // Invite logic
  const handleSendInvite = async () => {
    if (!inviteEmail) {
      toast({
        title: "Email is required",
        description: "Please enter an email address to send an invitation.",
        variant: "destructive",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to invite members.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get current user's team id
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("id", currentUser.id)
        .single();
      const team_id = userProfile?.team_id;
      if (!team_id) throw new Error("Cannot find team.");

      // Call edge function with team_id (invites to team as before)
      const { error } = await supabase.functions.invoke('invite-member', {
        body: {
          email: inviteEmail,
          role: inviteRole,
          team_id,
          redirectTo: window.location.origin,
        },
      });
      if (error) throw new Error(error.message);

      await db.logActivity({
        action: "team.member.invited",
        details: { email: inviteEmail, role: inviteRole },
        team_id,
        user_id: currentUser.id,
      });
      queryClient.invalidateQueries({ queryKey: ["activityLog"] });

      toast({
        title: "Invitation Sent",
        description: `An invitation email has been sent to ${inviteEmail}.`,
      });

      setInviteEmail("");
      setInviteRole("creator");
      setIsInviteDialogOpen(false);

      refetch();
    } catch (error: any) {
      toast({
        title: "Invitation Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handler: Change role for member
  const handleChangeRole = async (memberId: string, newRole: string) => {
    try {
      // Ensure newRole fits the strict union type for roles
      const validRole = ["admin", "buyer", "creator", "user", "moderator"].includes(newRole)
        ? (newRole as "admin" | "buyer" | "creator" | "user" | "moderator")
        : "user";

      const { error } = await supabase
        .from("profiles")
        .update({ role: validRole })
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: `Member's role has been updated to ${newRole}.`,
      });
      refetch();
    } catch (err: any) {
      toast({
        title: "Failed to Update Role",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Handler: Remove member (admins can't remove themselves)
  const handleRemoveMember = async (memberId: string) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.id === memberId) {
      toast({
        title: "Cannot Remove Yourself",
        description: "Admins cannot remove themselves from the account.",
        variant: "destructive",
      });
      return;
    }
    try {
      // Remove user from account
      const { error } = await supabase
        .from("profiles")
        .update({ account_id: null, team_id: null, role: "user" })
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: `The member has been removed from this account.`,
      });
      refetch();
    } catch (err: any) {
      toast({
        title: "Failed to Remove Member",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // --- Responsive and visual polish starts here ---

  // Card: Add max-w-2xl for moderate width, layout on mobile-stack/desk-row, padding, subtle border, soft background
  // Spacing: Tighter paddings
  // Header: Responsive stack
  // Loading/error states: always center, animate pulse for skeletons, error is bordered and visually distinct
  // Empty state: center/soft
  // Team list: responsive gap/grid

  return (
    <Card className="max-w-2xl mx-auto shadow-md bg-white/95 border border-gray-200">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-2">
        <div>
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Account Members</CardTitle>
          <CardDescription className="text-gray-500">
            Manage everyone who has access to your account
          </CardDescription>
        </div>
        {user.role === 'admin' && (
          <InviteMemberDialog
            open={isInviteDialogOpen}
            onOpenChange={setIsInviteDialogOpen}
            email={inviteEmail}
            onEmailChange={setInviteEmail}
            role={inviteRole}
            // cast for InviteMemberDialog
            onRoleChange={(role) => setInviteRole(role as "admin" | "buyer" | "creator" | "user" | "moderator")}
            onSendInvite={handleSendInvite}
          />
        )}
      </CardHeader>
      <CardContent className="space-y-4 p-2 sm:p-4">
        <div className="space-y-2">
          {isLoading && (
            <div className="flex flex-col gap-3 items-center justify-center py-8 sm:py-12 animate-pulse">
              <TeamLoadingSkeleton />
              <p className="text-xs text-gray-400">Loading team members...</p>
            </div>
          )}
          {isError && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <TeamErrorState />
              <button
                className="mt-4 px-4 py-2 rounded bg-muted text-gray-800 hover:bg-gray-100 transition"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </div>
          )}
          {accountMembers && accountMembers.length > 0 && (
            <div className="flex flex-col gap-3">
              <TeamMemberList
                members={accountMembers}
                currentUserRole={user.role}
                currentUserEmail={user.email}
                onRoleChange={handleChangeRole}
                onRemoveMember={handleRemoveMember}
              />
            </div>
          )}
          {accountMembers && accountMembers.length === 0 && (
            <div className="flex items-center justify-center w-full">
              <TeamEmptyState />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamTab;

