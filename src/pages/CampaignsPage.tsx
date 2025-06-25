
import React, { useState } from 'react';
import CampaignBuilder from '@/components/CampaignBuilder';
import CampaignList from '@/components/CampaignList';
import { Button } from '@/components/ui/button';
import CampaignDetailPage from './CampaignDetailPage';

interface CampaignsPageProps {
  orgId: string;
  initialView?: 'list' | 'builder' | 'detail';
}

const CampaignsPage = ({ orgId, initialView = 'list' }: CampaignsPageProps) => {
  const [view, setView] = useState<'list' | 'builder' | 'detail'>(initialView);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const handleBackToList = () => {
      // In a real app, you might want to confirm if there are unsaved changes.
      setView('list');
      setSelectedCampaignId(null);
  }

  const handleViewCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setView('detail');
  }

  if (view === 'builder') {
    return (
        <div className="space-y-4">
             <Button variant="outline" onClick={handleBackToList}>
                Back to Campaigns List
            </Button>
            <CampaignBuilder />
        </div>
    );
  }

  if (view === 'detail' && selectedCampaignId) {
    return (
        <div className="space-y-4">
             <Button variant="outline" onClick={handleBackToList}>
                Back to Campaigns List
            </Button>
            <CampaignDetailPage campaignId={selectedCampaignId} orgId={orgId} />
        </div>
    );
  }

  return <CampaignList orgId={orgId} onNewCampaign={() => setView('builder')} onViewCampaign={handleViewCampaign} />;
};

export default CampaignsPage;
