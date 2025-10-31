'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DealDetails } from '@/types';
import { TrendingUp, DollarSign, MapPin } from 'lucide-react';
import { calculateAPY } from '@/lib/financialCalculations';

interface DealCardProps {
  deal: DealDetails;
}

const getStatusColor = (status: string, currentMilestone: number) => {
  switch (status) {
    case 'proposal':
      return 'bg-[#3CA63820] text-[#2D8828] border-[#3CA638]';
    case 'confirmed':
      return currentMilestone === 0
        ? 'bg-[#3CA63820] text-[#2D8828] border-[#3CA638]'  // Active color (green)
        : 'bg-[#4EA4D920] text-[#5898C7] border-[#4EA4D9]'; // In Progress color (blue)
    case 'finished':
      return 'bg-[#3CA63820] text-[#2D8828] border-[#3CA638]';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusLabel = (status: string, currentMilestone: number) => {
  switch (status) {
    case 'proposal':
      return 'Active';
    case 'confirmed':
      return currentMilestone === 0 ? 'Active' : 'In Progress';
    case 'finished':
      return 'Completed';
    default:
      return status;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function DealCard({ deal }: DealCardProps) {
  const apy = calculateAPY(deal);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-3 mb-2">
          <CardTitle className="text-lg font-bold flex-1 min-w-0 line-clamp-1">
            {deal.name}
          </CardTitle>
          <Badge className={`${getStatusColor(deal.status, deal.currentMilestone)} flex-shrink-0 whitespace-nowrap`}>
            {getStatusLabel(deal.status, deal.currentMilestone)}
          </Badge>
        </div>
        <CardDescription className="text-sm line-clamp-1 min-h-[1.25rem]">
          {deal.description || '\u00A0'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* APY - Always visible */}
          <div className="flex items-center justify-between p-3 bg-[#3CA63820] rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3CA638]" />
              <span className="text-sm font-medium text-gray-700">APY</span>
            </div>
            <span className="text-xl font-bold text-[#3CA638]">{apy.toFixed(2)}%</span>
          </div>

          {/* Investment Amount - Always visible */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Investment</span>
            </div>
            <span className="text-sm font-semibold">{formatCurrency(deal.investmentAmount)}</span>
          </div>

          {/* Route - Always visible */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Route</span>
            </div>
            <span className="text-sm font-semibold">{deal.origin} → {deal.destination}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

