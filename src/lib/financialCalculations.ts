import { DealDetails } from '@/types';

/**
 * FINANCIAL CALCULATIONS
 * 
 * ⚠️ TEMPORARY FAKE VALUES ⚠️
 * All calculations currently return realistic fake/constant values for testing purposes.
 * These need to be replaced with actual calculations based on real data.
 * 
 * Current fake values:
 * - APY: 8-18% (based on contract ID)
 * - Revenue: 8-18% of investment amount
 * - ROI: 8-18%
 */

/**
 * Calculate revenue for a deal
 * TEMPORARY: Returns fake constant values for testing
 */
export function calculateRevenue(deal: DealDetails): number {
    // Return fake revenue based on investment amount (5-15% return)
    const fakeReturnRate = 0.08 + (Math.abs(deal.contractId) % 10) * 0.01; // 8-18%
    return Math.round(deal.investmentAmount * fakeReturnRate);
}

/**
 * Calculate APY (Annual Percentage Yield) for a deal
 * TEMPORARY: Returns fake constant values for testing
 */
export function calculateAPY(deal: DealDetails): number {
    // Return fake APY between 8-18%
    const baseAPY = 8;
    const variance = (Math.abs(deal.contractId) % 11); // 0-10
    return Number((baseAPY + variance).toFixed(2));
}

/**
 * Calculate simple ROI (Return on Investment)
 * TEMPORARY: Returns fake constant values for testing
 */
export function calculateROI(deal: DealDetails): number {
    if (deal.investmentAmount === 0) return 0;

    // Return fake ROI between 8-18%
    const baseROI = 8;
    const variance = (Math.abs(deal.contractId) % 11); // 0-10
    return Number((baseROI + variance).toFixed(2));
}

/**
 * Calculate annualized return (simpler version)
 * TEMPORARY: Returns fake constant values for testing
 */
export function calculateAnnualizedReturn(deal: DealDetails): number {
    if (deal.investmentAmount === 0) return 0;

    // Return fake annualized return between 8-18%
    const baseReturn = 8;
    const variance = (Math.abs(deal.contractId) % 11); // 0-10
    return Number((baseReturn + variance).toFixed(2));
}

/**
 * Calculate weighted average APY across multiple deals
 * Weighted by investment amount
 */
export function calculateWeightedAverageAPY(deals: DealDetails[]): number {
    if (deals.length === 0) return 0;

    let totalWeightedAPY = 0;
    let totalInvestment = 0;

    deals.forEach(deal => {
        const apy = calculateAPY(deal);
        const weight = deal.investmentAmount;

        // Only include valid APY values
        if (isFinite(apy) && apy > 0 && apy < 1000) {
            totalWeightedAPY += apy * weight;
            totalInvestment += weight;
        }
    });

    const averageAPY = totalInvestment > 0 ? totalWeightedAPY / totalInvestment : 0;

    return Number(averageAPY.toFixed(2));
}

/**
 * Calculate total revenue across all deals
 */
export function calculateTotalRevenue(deals: DealDetails[]): number {
    return deals.reduce((sum, deal) => sum + calculateRevenue(deal), 0);
}

/**
 * Calculate total investment across all deals
 */
export function calculateTotalInvestment(deals: DealDetails[]): number {
    return deals.reduce((sum, deal) => sum + deal.investmentAmount, 0);
}

/**
 * Calculate portfolio metrics
 */
export function calculatePortfolioMetrics(deals: DealDetails[]) {
    const totalInvestment = calculateTotalInvestment(deals);
    const totalRevenue = calculateTotalRevenue(deals);
    const weightedAPY = calculateWeightedAverageAPY(deals);
    const totalROI = totalInvestment > 0 ? (totalRevenue / totalInvestment) * 100 : 0;

    return {
        totalInvestment,
        totalRevenue,
        averageAPY: weightedAPY,
        totalROI,
        netProfit: totalRevenue,
        numberOfDeals: deals.length
    };
}

