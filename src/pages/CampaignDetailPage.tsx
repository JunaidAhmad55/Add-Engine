
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/database';
import type { Campaign, AdSet, AdVariant, CampaignStatus, AdVariantStatus, CampaignPerformance } from '@/lib/db-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CampaignPerformanceChart from '@/components/CampaignPerformanceChart';


interface CampaignDetailPageProps {
  campaignId: string;
  orgId: string;
}

const getStatusBadge = (status: CampaignStatus | AdVariantStatus) => {
    const statusStyles: { [key: string]: string } = {
        active: 'bg-green-100 text-green-800',
        paused: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800',
        draft: 'bg-gray-100 text-gray-800',
        archived: 'bg-gray-200 text-gray-600',
        pending: 'bg-orange-100 text-orange-800',
        rejected: 'bg-red-100 text-red-800',
    };
    const style = statusStyles[status] || statusStyles.draft;
    return <Badge className={`${style} hover:${style} capitalize border-transparent`}>{status}</Badge>;
};

const AdVariantsTable = ({ variants }: { variants: AdVariant[] }) => {
    if (variants.length === 0) return <p className="text-sm text-gray-500">No ad variants found for this ad set.</p>;
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Headline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Primary Text</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {variants.map(variant => (
                    <TableRow key={variant.id}>
                        <TableCell className="font-medium">{variant.headline || 'N/A'}</TableCell>
                        <TableCell>{getStatusBadge(variant.status)}</TableCell>
                        <TableCell className="text-xs">{variant.primary_text || 'N/A'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};


const CampaignDetailPage = ({ campaignId, orgId }: CampaignDetailPageProps) => {
    const { data: campaign, isLoading: isLoadingCampaign, error: campaignError } = useQuery<Campaign | null, Error>({
        queryKey: ['campaign', campaignId, orgId],
        queryFn: () => db.getCampaignById(campaignId, orgId),
        enabled: !!campaignId && !!orgId,
    });
    
    const { data: adSets, isLoading: isLoadingAdSets, error: adSetsError } = useQuery<AdSet[], Error>({
        queryKey: ['adSets', campaignId, orgId],
        queryFn: () => db.getAdSetsByCampaign(campaignId, orgId),
        enabled: !!campaignId && !!orgId,
    });

    const adSetIds = React.useMemo(() => adSets?.map(as => as.id) || [], [adSets]);

    const { data: allVariants, isLoading: isLoadingVariants, error: variantsError } = useQuery<AdVariant[], Error>({
        queryKey: ['adVariantsForCampaign', campaignId],
        queryFn: () => db.getAdVariantsByAdSetIds(adSetIds, orgId),
        enabled: adSetIds.length > 0,
    });

    const { data: performanceData, isLoading: isLoadingPerformance, error: performanceError } = useQuery<CampaignPerformance[], Error>({
        queryKey: ['campaignPerformance', campaignId, orgId],
        queryFn: () => db.getCampaignPerformance(campaignId, orgId),
        enabled: !!campaignId && !!orgId,
    });

    const variantsByAdSet = React.useMemo(() => {
        if (!allVariants) return new Map<string, AdVariant[]>();
        return allVariants.reduce((acc, variant) => {
            if (variant.ad_set_id) {
                const variants = acc.get(variant.ad_set_id) || [];
                variants.push(variant);
                acc.set(variant.ad_set_id, variants);
            }
            return acc;
        }, new Map<string, AdVariant[]>());
    }, [allVariants]);

    const performanceTotals = React.useMemo(() => {
        if (!performanceData) return { impressions: 0, clicks: 0, spend: 0, conversions: 0 };
        return performanceData.reduce((acc, curr) => {
            acc.impressions += curr.impressions;
            acc.clicks += curr.clicks;
            acc.spend += Number(curr.spend);
            acc.conversions += curr.conversions;
            return acc;
        }, { impressions: 0, clicks: 0, spend: 0, conversions: 0 });
    }, [performanceData]);

    const isLoading = isLoadingCampaign || isLoadingAdSets || isLoadingPerformance;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-3" />
                <span className="text-gray-600">Loading campaign details...</span>
            </div>
        );
    }

    const anyError = campaignError || adSetsError || variantsError || performanceError;
    if (anyError) {
        return (
            <div className="text-center p-12 text-red-600 bg-red-50 rounded-lg">
                <p className="font-medium">Error loading campaign data</p>
                <p className="text-sm">{anyError.message}</p>
            </div>
        );
    }

    if (!campaign) {
        return <p className="text-center p-12 text-gray-600">Campaign not found.</p>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{campaign.name}</CardTitle>
                            <CardDescription>
                                Launched on {campaign.launched_at ? format(new Date(campaign.launched_at), 'PPP') : 'N/A'}
                            </CardDescription>
                        </div>
                        {getStatusBadge(campaign.status)}
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Objective</h4>
                        <p className="text-lg font-medium">{campaign.objective}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Budget</h4>
                        <p className="text-lg font-medium">${campaign.budget?.toLocaleString()}/day</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Audience</h4>
                        <p className="text-sm text-gray-600">{campaign.audience || 'Not specified'}</p>
                    </div>
                </CardContent>
            </Card>

            <h3 className="text-xl font-bold text-gray-900">Performance Summary</h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${performanceTotals.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceTotals.impressions.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceTotals.clicks.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceTotals.conversions.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <CampaignPerformanceChart performanceData={performanceData || []} />


            <h3 className="text-xl font-bold text-gray-900">Ad Sets</h3>
            
            <div className="space-y-4">
                {!adSets || adSets.length === 0 ? (
                    <Card><CardContent className="p-6 text-center text-gray-500">No ad sets found for this campaign.</CardContent></Card>
                ) : (
                    adSets.map(adSet => (
                        <Card key={adSet.id}>
                            <CardHeader>
                                <CardTitle>{adSet.name}</CardTitle>
                                <CardDescription>Budget: ${adSet.budget?.toLocaleString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h4 className="font-semibold mb-2">Ad Variants</h4>
                                {isLoadingVariants ? (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
                                    </div>
                                ) : (
                                    <AdVariantsTable variants={variantsByAdSet.get(adSet.id) || []} />
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default CampaignDetailPage;
