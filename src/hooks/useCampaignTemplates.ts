
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { db, CampaignTemplate } from "@/lib/database"; // db will now use Supabase for templates
import { authService } from '@/lib/auth'; // To get current user
import type { CampaignCoreData } from '@/types/campaign';
import { supabase } from '@/integrations/supabase/client'; // For onAuthStateChange listener and type Json

interface UseCampaignTemplatesProps {
  setCampaignData: React.Dispatch<React.SetStateAction<CampaignCoreData>>;
  initialCampaignData: CampaignCoreData;
}

// Define a more specific type for default_audience content if known
interface DefaultAudienceContent {
  locations?: string[];
  ageRange?: [number, number];
  interests?: string[];
}

export function useCampaignTemplates({ setCampaignData, initialCampaignData }: UseCampaignTemplatesProps) {
  const { toast } = useToast();
  const [campaignTemplates, setCampaignTemplates] = useState<CampaignTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  const fetchTemplates = useCallback(async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      setCampaignTemplates([]);
      return;
    }
    setIsLoadingTemplates(true);
    try {
      const templates = await db.getCampaignTemplates(user.id);
      setCampaignTemplates(templates);
    } catch (error) {
      console.error("Failed to fetch campaign templates from Supabase:", error);
      toast({
        title: "Error",
        description: "Could not load campaign templates.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [toast]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) {
            fetchTemplates();
        }
      } else if (event === 'SIGNED_OUT') {
        setCampaignTemplates([]);
        setSelectedTemplateId(null);
      }
    });
    
    fetchTemplates(); // Initial fetch

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchTemplates]);

  const handleTemplateSelect = (templateId: string) => {
    const template = campaignTemplates.find(t => t.id === templateId);
    if (template) {
      let audienceString = '';
      // template.default_audience is JSONB from Supabase. It might be null or an object.
      // Supabase client usually parses JSONB to an object automatically.
      // Cast to DefaultAudienceContent for type safety if structure is known.
      const audience = template.default_audience as DefaultAudienceContent | null; 
      if (audience) {
        const parts = [];
        if (audience.locations && audience.locations.length > 0) {
          parts.push(`Locations: ${audience.locations.join(', ')}`);
        }
        if (audience.ageRange) {
          parts.push(`Age: ${audience.ageRange.join('-')}`);
        }
        if (audience.interests && audience.interests.length > 0) {
          parts.push(`Interests: ${audience.interests.join(', ')}`);
        }
        audienceString = parts.join('; ');
      }

      setCampaignData(prev => ({
        ...initialCampaignData,
        name: template.name ? `${template.name} - Campaign` : prev.name,
        objective: template.default_objective || prev.objective, // snake_case is correct here
        budget: template.default_budget?.toString() || prev.budget, // snake_case is correct here
        audience: audienceString || prev.audience,
      }));
      setSelectedTemplateId(templateId);
      toast({
        title: "Template Applied",
        description: `Settings from "${template.name}" have been pre-filled.`,
      });
    }
  };
  
  const resetTemplates = () => {
    setSelectedTemplateId(null);
  }

  return {
    campaignTemplates,
    selectedTemplateId,
    handleTemplateSelect,
    resetTemplates,
    isLoadingTemplates,
    refreshTemplates: fetchTemplates,
  };
}

