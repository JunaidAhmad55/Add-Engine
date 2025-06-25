
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createCampaignTemplate } from '@/lib/services/campaign-template-service';
import { authService } from '@/lib/auth';
import type { CampaignCoreData } from '@/types/campaign';
import { Bookmark } from 'lucide-react';

interface SaveCampaignTemplateProps {
  campaignData: CampaignCoreData;
  disabled: boolean;
}

const SaveCampaignTemplate: React.FC<SaveCampaignTemplateProps> = ({ campaignData, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast({ title: 'Error', description: 'Template name cannot be empty.', variant: 'destructive' });
      return;
    }
    const user = authService.getCurrentUser();
    if (!user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to save a template.', variant: 'destructive' });
      return;
    }

    try {
      await createCampaignTemplate({
        name: templateName,
        default_objective: campaignData.objective || null,
        default_budget: campaignData.budget ? parseFloat(campaignData.budget) : null,
        default_audience: campaignData.audience ? { description: campaignData.audience } : null,
        default_placements: null,
        user_id: user.id,
      });

      toast({ title: 'Success!', description: `Template "${templateName}" has been saved.` });
      await queryClient.invalidateQueries({ queryKey: ['campaignTemplates'] });
      setIsOpen(false);
      setTemplateName('');
    } catch (error) {
      console.error('Failed to save template:', error);
      toast({ title: 'Save Failed', description: 'Could not save the campaign template.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Bookmark className="h-4 w-4 mr-2" />
          Save as Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Campaign as Template</DialogTitle>
          <DialogDescription>
            Save the current settings as a template for future use.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Q3 Lead Gen Template"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCampaignTemplate;
