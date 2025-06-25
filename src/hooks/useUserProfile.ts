
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/lib/auth";
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Define Profile type
export interface UserProfile {
  id: string;
  team_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  account_id: string | null;
  account_name: string | null;
  account_role: "admin" | "buyer" | "creator" | null;
}

export const useUserProfile = () => {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const initialUser = authService.getCurrentUser();
    setCurrentUser(initialUser);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: userProfile, isLoading: isLoadingProfile, error: profileError, refetch: refetchUserProfile } = useQuery<UserProfile, Error>({
    queryKey: ['userProfile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("User not authenticated for profile fetch");
      
      console.log("Fetching profile for user:", currentUser.id);
      
      // Get user's profile info (with account_id)
      const { data: profile, error: error1 } = await supabase
        .from('profiles')
        .select('id, team_id, full_name, avatar_url, role, account_id')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error1) {
        console.error("Profile fetch error:", error1);
        throw new Error("Failed to fetch profile: " + error1.message);
      }
      
      if (!profile) {
        console.warn("No profile found for user:", currentUser.id);
        throw new Error("Profile not found. This may be because your account is still being set up. Please try refreshing the page or contact support if the issue persists.");
      }

      console.log("Profile found:", profile);

      let account_name: string | null = null;
      if (profile.account_id) {
        const { data: account, error: error2 } = await supabase
          .from('accounts')
          .select('name')
          .eq('id', profile.account_id)
          .maybeSingle();
        if (error2) {
          console.warn("Account fetch error:", error2);
          account_name = null;
        } else {
          account_name = account?.name ?? null;
        }
      }

      let account_role: "admin" | "buyer" | "creator" | null = null;
      // Map profile role to account_role
      if (profile.role === "admin") account_role = "admin";
      else if (profile.role === "buyer") account_role = "buyer";
      else if (profile.role === "creator" || profile.role === "user") account_role = "creator";
      else account_role = null;

      const result = {
        id: profile.id,
        team_id: profile.team_id ?? null,
        full_name: profile.full_name ?? null,
        avatar_url: profile.avatar_url ?? null,
        role: profile.role,
        account_id: profile.account_id ?? null,
        account_name,
        account_role,
      } as UserProfile;

      console.log("Final profile result:", result);
      return result;
    },
    enabled: !!currentUser?.id,
    retry: 2,
    retryDelay: 1000,
  });

  return { currentUser, userProfile, isLoadingProfile, profileError, refetchUserProfile };
};
