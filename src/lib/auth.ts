// Authentication service
import { supabase } from '@/integrations/supabase/client';
import type { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthResult {
  success: boolean;
  user?: SupabaseUser;
  session?: Session;
  error?: string | AuthError;
}

class AuthService {
  private currentSession: Session | null = null;
  private currentUser: SupabaseUser | null = null;

  constructor() {
    // Listen to auth state changes to keep currentUser and currentSession updated.
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession = session;
      this.currentUser = session?.user ?? null;
      if (event === 'INITIAL_SESSION') {
        // Handle initial session
      } else if (event === 'SIGNED_IN') {
        // Handle sign in
      } else if (event === 'SIGNED_OUT') {
        // Handle sign out
      }
    });
    // Eagerly fetch session on instantiation
    this.loadSession(); 
  }

  private async loadSession() {
    const { data: { session } } = await supabase.auth.getSession();
    this.currentSession = session;
    this.currentUser = session?.user ?? null;
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    if (data.session && data.user) {
      this.currentSession = data.session;
      this.currentUser = data.user;
      return { success: true, user: data.user, session: data.session };
    }
    return { success: false, error: 'Login failed: No session or user data returned.' };
  }

  async signup(name: string, email: string, password: string): Promise<AuthResult> {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { 
          full_name: name
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      this.currentUser = data.user;
      this.currentSession = data.session;
      return { success: true, user: data.user, session: data.session ?? undefined };
    }
    
    return { success: true, user: data.user ?? undefined, session: data.session ?? undefined };
  }

  async logout(): Promise<{ error?: AuthError | string }> {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      this.currentUser = null;
      this.currentSession = null;
    }
    return { error: error || undefined };
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!this.currentUser || !this.currentUser.email) {
      return { success: false, error: 'User not authenticated.' };
    }

    // 1. Verify current password by trying to sign in again
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: this.currentUser.email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, error: 'Current password is not correct.' };
    }

    // 2. If verification is successful, update to the new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  }

  getCurrentUser(): SupabaseUser | null {
    return this.currentUser;
  }
  
  async refreshSession(): Promise<void> {
    await supabase.auth.refreshSession();
  }

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    this.currentSession = session;
    this.currentUser = session?.user ?? null;
    return session;
  }
  
  isAuthenticated(): boolean {
    return !!this.currentSession && !!this.currentUser;
  }

  async hasRole(role: 'admin' | 'editor'): Promise<boolean> {
    await this.getSession();
    if (!this.currentUser) return false;

    console.warn("hasRole check is currently a placeholder and may not reflect actual user roles.");
    return true; // Placeholder
  }
}

export const authService = new AuthService();
