
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react';
import { CampaignMetrics } from '@/hooks/useCampaigns';
import { format } from 'date-fns';
import CampaignRecipientActivity from './CampaignRecipientActivity';

interface CampaignMetricsCardProps {
  metrics: CampaignMetrics;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const CampaignMetricsCard = ({ metrics, onRefresh, isRefreshing }: CampaignMetricsCardProps) => {
  const [showRecipientActivity, setShowRecipientActivity] = useState(false);

  const calculateRate = (numerator: number, denominator: number): number => {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
  };

  const openRate = calculateRate(metrics.opens, metrics.delivered);
  const clickRate = calculateRate(metrics.clicks, metrics.delivered);
  const bounceRate = calculateRate(metrics.bounces, metrics.delivered);
  const unsubscribeRate = calculateRate(metrics.unsubscribes, metrics.delivered);

  const getTrendIcon = (rate: number, threshold: number, inverse = false) => {
    const isGood = inverse ? rate < threshold : rate > threshold;
    if (rate === 0) return <Minus className="w-3 h-3 text-gray-400" />;
    return isGood ? 
      <TrendingUp className="w-3 h-3 text-green-500" /> : 
      <TrendingDown className="w-3 h-3 text-red-500" />;
  };

  const getRateBadgeVariant = (rate: number, goodThreshold: number, okThreshold: number, inverse = false) => {
    if (inverse) {
      if (rate <= goodThreshold) return "default";
      if (rate <= okThreshold) return "secondary";
      return "destructive";
    } else {
      if (rate >= goodThreshold) return "default";
      if (rate >= okThreshold) return "secondary";
      return "outline";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Campaign Metrics</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Updated: {format(new Date(metrics.last_updated), 'MMM dd, HH:mm')}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRecipientActivity(true)}
              className="h-8 w-8 p-0"
              title="View detailed recipient activity"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Delivered */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Delivered</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{metrics.delivered.toLocaleString()}</div>
            </div>

            {/* Opens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Opens</span>
                {getTrendIcon(openRate, 20)}
              </div>
              <div className="text-2xl font-bold text-green-600">{metrics.opens.toLocaleString()}</div>
              <Badge variant={getRateBadgeVariant(openRate, 25, 15)} className="text-xs">
                {openRate.toFixed(1)}% rate
              </Badge>
            </div>

            {/* Clicks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Clicks</span>
                {getTrendIcon(clickRate, 3)}
              </div>
              <div className="text-2xl font-bold text-purple-600">{metrics.clicks.toLocaleString()}</div>
              <Badge variant={getRateBadgeVariant(clickRate, 5, 2)} className="text-xs">
                {clickRate.toFixed(1)}% rate
              </Badge>
            </div>

            {/* Bounces */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Bounces</span>
                {getTrendIcon(bounceRate, 5, true)}
              </div>
              <div className="text-2xl font-bold text-red-600">{metrics.bounces.toLocaleString()}</div>
              <Badge variant={getRateBadgeVariant(bounceRate, 2, 5, true)} className="text-xs">
                {bounceRate.toFixed(1)}% rate
              </Badge>
            </div>

            {/* Additional Metrics Row */}
            <div className="space-y-1">
              <span className="text-xs text-gray-500">Soft Bounces</span>
              <div className="text-lg font-semibold text-orange-600">{metrics.soft_bounces.toLocaleString()}</div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500">Hard Bounces</span>
              <div className="text-lg font-semibold text-red-700">{metrics.hard_bounces.toLocaleString()}</div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500">Unsubscribes</span>
              <div className="text-lg font-semibold text-gray-600">{metrics.unsubscribes.toLocaleString()}</div>
              <Badge variant={getRateBadgeVariant(unsubscribeRate, 0.5, 1, true)} className="text-xs">
                {unsubscribeRate.toFixed(2)}%
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500">Spam Reports</span>
              <div className="text-lg font-semibold text-red-800">{metrics.spam_reports.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CampaignRecipientActivity
        campaignId={metrics.campaign_id}
        isOpen={showRecipientActivity}
        onOpenChange={setShowRecipientActivity}
      />
    </>
  );
};

export default CampaignMetricsCard;
