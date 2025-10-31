'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DealCard from '@/components/DealCard';
import DealFilters, { FilterOptions } from '@/components/DealFilters';
import { useICPShipments } from '@/hooks/useICPShipments';
import { DealDetails } from '@/types';
import { calculatePortfolioMetrics } from '@/lib/financialCalculations';

export default function DealsInvestorDashboard() {
  const router = useRouter();
  const { shipments: deals, loading } = useICPShipments();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in-progress' | 'completed'>('active');
  const [filters, setFilters] = useState<FilterOptions>({
    origins: [],
    destinations: [],
    statuses: [],
    transports: [],
    minInvestment: null,
  });

  const applyFilters = (dealsToFilter: DealDetails[]): DealDetails[] => {
    return dealsToFilter.filter((deal) => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'active' && !(deal.status === 'proposal' || (deal.status === 'confirmed' && deal.currentMilestone === 0))) {
          return false;
        }
        if (statusFilter === 'in-progress' && !(deal.status === 'confirmed' && deal.currentMilestone > 0)) {
          return false;
        }
        if (statusFilter === 'completed' && deal.status !== 'finished') {
          return false;
        }
      }

      // Origin filter
      if (filters.origins.length > 0 && !filters.origins.includes(deal.origin)) {
        return false;
      }

      // Destination filter
      if (filters.destinations.length > 0 && !filters.destinations.includes(deal.destination)) {
        return false;
      }

      // Transport filter
      if (filters.transports.length > 0 && !filters.transports.includes(deal.transport)) {
        return false;
      }

      // Minimum investment filter
      if (filters.minInvestment !== null && deal.investmentAmount < filters.minInvestment) {
        return false;
      }

      return true;
    });
  };

  const filteredDeals = applyFilters(deals);

  // Calculate portfolio metrics using the new calculation functions
  const portfolioMetrics = calculatePortfolioMetrics(filteredDeals);
  const totalInvested = portfolioMetrics.totalInvestment;
  const totalRevenue = portfolioMetrics.totalRevenue;
  const averageAPY = portfolioMetrics.averageAPY;

  const activeCount = deals.filter(d => d.status === 'proposal' || (d.status === 'confirmed' && d.currentMilestone === 0)).length;
  const inProgressCount = deals.filter(d => d.status === 'confirmed' && d.currentMilestone > 0).length;
  const completedCount = deals.filter(d => d.status === 'finished').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading deals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <main className="container mx-auto py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#3CA638]">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Invested</h3>
            <p className="text-2xl font-bold text-[#3CA638]">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2A007]">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue Generated</h3>
            <p className="text-2xl font-bold text-[#F2A007]">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#4EA4D9]">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Average APY</h3>
            <p className="text-2xl font-bold text-[#4EA4D9]">{averageAPY.toFixed(2)}%</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${statusFilter === 'all'
                ? 'bg-[#3CA638] text-white shadow-[0_4px_14px_0_rgba(60,166,56,0.25)]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All ({deals.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${statusFilter === 'active'
                ? 'bg-[#3CA638] text-white shadow-[0_4px_14px_0_rgba(60,166,56,0.25)]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${statusFilter === 'in-progress'
                ? 'bg-[#3CA638] text-white shadow-[0_4px_14px_0_rgba(60,166,56,0.25)]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${statusFilter === 'completed'
                ? 'bg-[#3CA638] text-white shadow-[0_4px_14px_0_rgba(60,166,56,0.25)]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <DealFilters onFilterChange={setFilters} />

        {/* Deals Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {statusFilter === 'all'
              ? 'All Deals'
              : statusFilter === 'active'
                ? 'Active Deals'
                : statusFilter === 'in-progress'
                  ? 'In Progress Deals'
                  : 'Completed Deals'}
          </h2>
          <p className="text-gray-600 mb-6">
            {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => router.push(`/shipments/${deal.id}`)}
            >
              <DealCard deal={deal} />
            </div>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No deals match the selected filters</p>
          </div>
        )}
      </main>
    </div>
  );
}

