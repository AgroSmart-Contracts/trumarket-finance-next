import { NextRequest, NextResponse } from 'next/server';
import { deployedDataService } from '@/services/deployedDataService';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('API Route: Fetching activities for shipment ID:', id);

        // Convert string ID to number
        const nftId = parseInt(id, 10);
        if (isNaN(nftId)) {
            return NextResponse.json({ error: 'Invalid shipment ID format' }, { status: 400 });
        }

        const activities = await deployedDataService.getShipmentActivity(nftId);
        console.log('API Route: Activities count:', activities?.length || 0);

        return NextResponse.json(activities);
    } catch (error) {
        console.error('API Route: Error fetching activities:', error);
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}