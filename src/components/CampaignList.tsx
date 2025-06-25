import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/database';
import type { Campaign, CampaignStatus } from '@/lib/db-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface CampaignListProps {
  orgId: string;
  onNewCampaign: () => void;
  onViewCampaign: (campaignId: string) => void;
}

const getStatusBadge = (status: CampaignStatus) => {
    const statusStyles = {
        active: 'bg-green-100 text-green-800',
        paused: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800',
        draft: 'bg-gray-100 text-gray-800',
        archived: 'bg-gray-200 text-gray-600',
    };
    const style = statusStyles[status] || statusStyles.draft;
    return <Badge className={`${style} hover:${style} capitalize border-transparent`}>{status}</Badge>;
};

const CampaignList = ({ orgId, onNewCampaign, onViewCampaign }: CampaignListProps) => {
  const { data: campaigns, isLoading, error } = useQuery<Campaign[], Error>({
    queryKey: ['campaigns', orgId],
    queryFn: () => db.getCampaignsByOrg(orgId),
    enabled: !!orgId,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Campaigns</h2>
          <p className="text-gray-600">Manage all your campaigns in one place.</p>
        </div>
        <Button onClick={onNewCampaign}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>A list of all campaigns for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            // Skeleton loader for campaigns table
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Objective</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(4)].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 rounded" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {error && (
             <div className="text-center p-12 text-red-600 bg-red-50 rounded-lg">
               <p className="font-medium">Error loading campaigns</p>
               <p className="text-sm">{error.message}</p>
             </div>
          )}
          {!isLoading && !error && campaigns && (
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Objective</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-7 text-gray-400">
                        <FolderOpen className="w-8 h-8 mb-2" />
                        <div className="font-semibold">No campaigns found</div>
                        <div className="text-sm text-gray-400 mt-1">
                          Start by creating your first campaign.
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(campaign => (
                    <TableRow key={campaign.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell>${campaign.budget?.toLocaleString()}</TableCell>
                      <TableCell>{campaign.objective}</TableCell>
                      <TableCell>{format(new Date(campaign.created_at), 'PPP')}</TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => onViewCampaign(campaign.id)}>
                              View
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignList;
