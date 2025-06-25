import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Video as TikTokIcon } from "lucide-react";
import { CampaignTemplate } from "@/lib/database"; // CampaignTemplate is Database['public']['Tables']['campaign_templates']['Row']

interface CampaignData {
  name: string;
  objective: string;
  budget: string;
  audience: string;
  // creatives and copyVariants are not managed in this step directly
}

interface Step1SettingsProps {
  campaignData: CampaignData;
  setCampaignData: React.Dispatch<React.SetStateAction<CampaignData>>;
  campaignTemplates: CampaignTemplate[];
  selectedTemplateId: string | null;
  handleTemplateSelect: (templateId: string) => void;
  objectives: string[];
}

const Step1Settings: React.FC<Step1SettingsProps> = ({
  campaignData,
  setCampaignData,
  campaignTemplates,
  selectedTemplateId,
  handleTemplateSelect,
  objectives,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xl font-semibold mb-4">Start with a Template (Optional)</Label>
        {campaignTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 mb-6">
            {campaignTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedTemplateId === template.id ? 'border-blue-600 ring-2 ring-blue-500 shadow-blue-200' : 'border-gray-200'}`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600 space-y-1">
                  {/* Changed to snake_case below */}
                  <p><strong>Objective:</strong> {template.default_objective || 'N/A'}</p>
                  <p><strong>Budget:</strong> ${template.default_budget || 'N/A'}/day</p>
                  {/* Assuming default_audience is JSONB and parsed by Supabase client */}
                  {(template.default_audience as any)?.locations && <p><strong>Locations:</strong> {(template.default_audience as any).locations.join(', ')}</p>}
                  {(template.default_audience as any)?.ageRange && <p><strong>Age:</strong> {(template.default_audience as any).ageRange.join('-')}</p>}
                  {(template.default_audience as any)?.interests && <p className="truncate"><strong>Interests:</strong> {(template.default_audience as any).interests.join(', ')}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2 mb-6">No campaign templates found. You can create them in the settings.</p>
        )}
        <Separator className="my-6" />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">
          {selectedTemplateId ? "Customize Campaign Settings" : "Or, Set Up Manually"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Spring Sale Q2 2024"
                value={campaignData.name}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="objective">Campaign Objective</Label>
              <Select value={campaignData.objective} onValueChange={(value) => setCampaignData(prev => ({ ...prev, objective: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map((objectiveName) => (
                    <SelectItem key={objectiveName} value={objectiveName}>
                      {objectiveName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget">Daily Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="100"
                value={campaignData.budget}
                onChange={(e) => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="audience">Target Audience Details</Label>
              <Input
                id="audience"
                placeholder="e.g., Locations: US, CA; Age: 25-45; Interests: Tech"
                value={campaignData.audience}
                onChange={(e) => setCampaignData(prev => ({ ...prev, audience: e.target.value }))}
              />
               <p className="text-xs text-gray-500 mt-1">Describe your target audience (locations, age, interests etc.). This is a simplified field for now.</p>
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="mt-6">
          <Label className="text-base font-medium">Ad Platforms</Label>
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-blue-50 border-blue-200">
              <Facebook className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Facebook</span>
              <Badge variant="secondary">Connected</Badge>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-purple-50 border-purple-200">
              <Instagram className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Instagram</span>
              <Badge variant="secondary">Connected</Badge>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 border-gray-200">
              <TikTokIcon className="h-5 w-5 text-black" />
              <span className="font-medium">TikTok</span>
              <Badge variant="secondary">Connected</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Settings;
