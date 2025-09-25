import { NextRequest, NextResponse } from 'next/server';
import { dealLogService } from '@/services/dealLogService';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dealId = searchParams.get('dealId');

        if (!dealId) {
            return NextResponse.json({ error: 'dealId parameter is required' }, { status: 400 });
        }

        const dealIdNum = parseInt(dealId, 10);
        if (isNaN(dealIdNum)) {
            return NextResponse.json({ error: 'Invalid dealId format' }, { status: 400 });
        }

        const logs = await dealLogService.findDealLogs(dealIdNum);
        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching deal logs:', error);
        return NextResponse.json({ error: 'Failed to fetch deal logs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const log = await dealLogService.createDealLog(body);
        return NextResponse.json(log);
    } catch (error) {
        console.error('Error creating deal log:', error);
        return NextResponse.json({ error: 'Failed to create deal log' }, { status: 500 });
    }
}
