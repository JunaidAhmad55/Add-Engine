export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_integrations: {
        Row: {
          access_token: string
          account_label: string | null
          created_at: string | null
          expires_in: number | null
          extra_data: Json | null
          id: string
          platform: string
          provider_account_id: string | null
          refresh_token: string | null
          team_id: string
          token_type: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          account_label?: string | null
          created_at?: string | null
          expires_in?: number | null
          extra_data?: Json | null
          id?: string
          platform: string
          provider_account_id?: string | null
          refresh_token?: string | null
          team_id: string
          token_type?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          account_label?: string | null
          created_at?: string | null
          expires_in?: number | null
          extra_data?: Json | null
          id?: string
          platform?: string
          provider_account_id?: string | null
          refresh_token?: string | null
          team_id?: string
          token_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      accounts: {
        Row: {
          created_at: string
          id: string
          name: string
          plan_type: string
          seat_limit: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          plan_type?: string
          seat_limit?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          plan_type?: string
          seat_limit?: number
          updated_at?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action: string
          comment: string | null
          created_at: string
          details: Json | null
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          action: string
          comment?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          action?: string
          comment?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_sets: {
        Row: {
          audience: string | null
          budget: number | null
          campaign_id: string
          created_at: string
          id: string
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          audience?: string | null
          budget?: number | null
          campaign_id: string
          created_at?: string
          id?: string
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          audience?: string | null
          budget?: number | null
          campaign_id?: string
          created_at?: string
          id?: string
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_sets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_sets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_variants: {
        Row: {
          ad_set_id: string | null
          asset_id: string
          call_to_action: string | null
          created_at: string
          headline: string | null
          id: string
          meta_ad_id: string | null
          org_id: string
          primary_text: string | null
          status: Database["public"]["Enums"]["ad_variant_status"]
          updated_at: string
        }
        Insert: {
          ad_set_id?: string | null
          asset_id: string
          call_to_action?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          meta_ad_id?: string | null
          org_id: string
          primary_text?: string | null
          status?: Database["public"]["Enums"]["ad_variant_status"]
          updated_at?: string
        }
        Update: {
          ad_set_id?: string | null
          asset_id?: string
          call_to_action?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          meta_ad_id?: string | null
          org_id?: string
          primary_text?: string | null
          status?: Database["public"]["Enums"]["ad_variant_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_variants_ad_set_id_fkey"
            columns: ["ad_set_id"]
            isOneToOne: false
            referencedRelation: "ad_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_variants_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_variants_org_id_fk"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_generation_audit_log: {
        Row: {
          created_at: string
          event_type: string
          id: string
          org_id: string
          output: string | null
          prompt: string | null
          token_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          org_id: string
          output?: string | null
          prompt?: string | null
          token_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          org_id?: string
          output?: string | null
          prompt?: string | null
          token_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generation_audit_log_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generation_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          org_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          org_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          org_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          angle: string | null
          created_at: string
          file_type: Database["public"]["Enums"]["asset_file_type"]
          filename: string
          folder_id: string | null
          height: number | null
          hook: string | null
          id: string
          notes: string | null
          org_id: string
          size_bytes: number | null
          tags: string[] | null
          url: string
          user_id: string
          width: number | null
        }
        Insert: {
          angle?: string | null
          created_at?: string
          file_type: Database["public"]["Enums"]["asset_file_type"]
          filename: string
          folder_id?: string | null
          height?: number | null
          hook?: string | null
          id?: string
          notes?: string | null
          org_id: string
          size_bytes?: number | null
          tags?: string[] | null
          url: string
          user_id: string
          width?: number | null
        }
        Update: {
          angle?: string | null
          created_at?: string
          file_type?: Database["public"]["Enums"]["asset_file_type"]
          filename?: string
          folder_id?: string | null
          height?: number | null
          hook?: string | null
          id?: string
          notes?: string | null
          org_id?: string
          size_bytes?: number | null
          tags?: string[] | null
          url?: string
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_org_id_fk"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_asset_folder"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "asset_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_performance: {
        Row: {
          campaign_id: string
          clicks: number
          conversions: number
          created_at: string
          date: string
          id: string
          impressions: number
          org_id: string
          spend: number
          updated_at: string
        }
        Insert: {
          campaign_id: string
          clicks?: number
          conversions?: number
          created_at?: string
          date: string
          id?: string
          impressions?: number
          org_id: string
          spend?: number
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          clicks?: number
          conversions?: number
          created_at?: string
          date?: string
          id?: string
          impressions?: number
          org_id?: string
          spend?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_performance_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_templates: {
        Row: {
          created_at: string
          default_audience: Json | null
          default_budget: number | null
          default_objective: string | null
          default_placements: Json | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_audience?: Json | null
          default_budget?: number | null
          default_objective?: string | null
          default_placements?: Json | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_audience?: Json | null
          default_budget?: number | null
          default_objective?: string | null
          default_placements?: Json | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          audience: string | null
          budget: number | null
          created_at: string
          id: string
          launched_at: string | null
          meta_campaign_id: string | null
          name: string
          objective: string | null
          org_id: string
          status: Database["public"]["Enums"]["campaign_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          audience?: string | null
          budget?: number | null
          created_at?: string
          id?: string
          launched_at?: string | null
          meta_campaign_id?: string | null
          name: string
          objective?: string | null
          org_id: string
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          audience?: string | null
          budget?: number | null
          created_at?: string
          id?: string
          launched_at?: string | null
          meta_campaign_id?: string | null
          name?: string
          objective?: string | null
          org_id?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_org_id_fk"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          created_at: string
          friendship_start_date: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          friendship_start_date: string
          id: string
          username: string
        }
        Update: {
          created_at?: string
          friendship_start_date?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      meta_oauth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          refresh_token: string | null
          team_id: string
          token_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          team_id: string
          token_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          team_id?: string
          token_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meta_oauth_tokens_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meta_oauth_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_id: string | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          team_id: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          mentions: string[] | null
          prompt_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          mentions?: string[] | null
          prompt_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          mentions?: string[] | null
          prompt_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_comments_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_versions: {
        Row: {
          author_id: string
          context_section: string
          created_at: string
          id: string
          output_section: string
          prompt_id: string
          role_section: string
          summary: string | null
          title: string
          version_number: number
        }
        Insert: {
          author_id: string
          context_section: string
          created_at?: string
          id?: string
          output_section: string
          prompt_id: string
          role_section: string
          summary?: string | null
          title: string
          version_number: number
        }
        Update: {
          author_id?: string
          context_section?: string
          created_at?: string
          id?: string
          output_section?: string
          prompt_id?: string
          role_section?: string
          summary?: string | null
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_versions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_votes: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_votes_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          author_id: string
          context_section: string
          created_at: string
          id: string
          output_section: string
          parent_prompt_id: string | null
          role_section: string
          status: Database["public"]["Enums"]["prompt_status"]
          summary: string | null
          tags: string[] | null
          team_id: string | null
          title: string
          updated_at: string
          version_number: number
        }
        Insert: {
          author_id: string
          context_section: string
          created_at?: string
          id?: string
          output_section: string
          parent_prompt_id?: string | null
          role_section: string
          status?: Database["public"]["Enums"]["prompt_status"]
          summary?: string | null
          tags?: string[] | null
          team_id?: string | null
          title: string
          updated_at?: string
          version_number?: number
        }
        Update: {
          author_id?: string
          context_section?: string
          created_at?: string
          id?: string
          output_section?: string
          parent_prompt_id?: string | null
          role_section?: string
          status?: Database["public"]["Enums"]["prompt_status"]
          summary?: string | null
          tags?: string[] | null
          team_id?: string | null
          title?: string
          updated_at?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_parent_prompt_id_fkey"
            columns: ["parent_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_ai_quota: {
        Row: {
          id: string
          last_reset: string
          org_id: string
          token_quota: number
          token_used: number
          updated_at: string
        }
        Insert: {
          id?: string
          last_reset?: string
          org_id: string
          token_quota?: number
          token_used?: number
          updated_at?: string
        }
        Update: {
          id?: string
          last_reset?: string
          org_id?: string
          token_quota?: number
          token_used?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_ai_quota_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_ai_settings: {
        Row: {
          god_mode_enabled: boolean
          id: string
          openai_api_key: string | null
          org_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          god_mode_enabled?: boolean
          id?: string
          openai_api_key?: string | null
          org_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          god_mode_enabled?: boolean
          id?: string
          openai_api_key?: string | null
          org_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_ai_settings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_ai_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["team_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["team_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["team_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_account_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_team_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_team_id_safe: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      ad_variant_status: "pending" | "active" | "rejected"
      app_role: "admin" | "moderator" | "user" | "buyer" | "creator"
      asset_file_type: "image" | "video" | "pdf" | "file"
      campaign_status: "draft" | "launching" | "active" | "paused" | "completed"
      prompt_status: "draft" | "pending" | "approved" | "deprecated"
      team_type:
        | "sales"
        | "marketing_brand"
        | "marketing_content"
        | "marketing_paid"
        | "marketing_seo"
        | "solutions_presales"
        | "project_management"
        | "account_management"
        | "product_engineering"
        | "hr_people"
        | "customer_success"
        | "finance"
        | "partnerships"
        | "legal_compliance"
        | "operations"
        | "corporate_comms"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ad_variant_status: ["pending", "active", "rejected"],
      app_role: ["admin", "moderator", "user", "buyer", "creator"],
      asset_file_type: ["image", "video", "pdf", "file"],
      campaign_status: ["draft", "launching", "active", "paused", "completed"],
      prompt_status: ["draft", "pending", "approved", "deprecated"],
      team_type: [
        "sales",
        "marketing_brand",
        "marketing_content",
        "marketing_paid",
        "marketing_seo",
        "solutions_presales",
        "project_management",
        "account_management",
        "product_engineering",
        "hr_people",
        "customer_success",
        "finance",
        "partnerships",
        "legal_compliance",
        "operations",
        "corporate_comms",
      ],
    },
  },
} as const
