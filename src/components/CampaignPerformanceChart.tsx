
import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { CampaignPerformance } from '@/lib/db-types';
import { format } from 'date-fns';

interface CampaignPerformanceChartProps {
  performanceData: CampaignPerformance[];
}

const chartConfig = {
  impressions: { label: 'Impressions', color: 'hsl(var(--chart-1))' },
  clicks: { label: 'Clicks', color: 'hsl(var(--chart-2))' },
  spend: { label: 'Spend ($)', color: 'hsl(var(--chart-5))' },
  conversions: { label: 'Conversions', color: 'hsl(var(--chart-4))' },
};

const CampaignPerformanceChart = ({ performanceData }: CampaignPerformanceChartProps) => {
  const chartData = React.useMemo(() => {
    return performanceData.map(item => ({
      ...item,
      date: format(new Date(item.date), 'MMM d'),
      spend: Number(item.spend),
    }));
  }, [performanceData]);

  if (chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>No performance data available for this campaign yet.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-60 items-center justify-center">
                <p className="text-sm text-gray-500">Check back later for performance metrics.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>Daily campaign performance metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Area type="monotone" dataKey="impressions" stackId="a" stroke={chartConfig.impressions.color} fill={chartConfig.impressions.color} fillOpacity={0.4} name="Impressions" />
            <Area type="monotone" dataKey="clicks" stackId="b" stroke={chartConfig.clicks.color} fill={chartConfig.clicks.color} fillOpacity={0.4} name="Clicks" />
            <Area type="monotone" dataKey="spend" stackId="c" stroke={chartConfig.spend.color} fill={chartConfig.spend.color} fillOpacity={0.4} name="Spend ($)" />
            <Area type="monotone" dataKey="conversions" stackId="d" stroke={chartConfig.conversions.color} fill={chartConfig.conversions.color} fillOpacity={0.4} name="Conversions" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CampaignPerformanceChart;
