import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { BingoService } from '@/lib/bingo/db';

export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user) {
          return NextResponse.json({ error: 'User is required' }, { status: 400 });
        }
        const activities = await BingoService.getActivities(user);
        return NextResponse.json(activities);
      } catch (error: any) {
        console.error('Load activities error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to load activities' },
          { status: 500 }
        );
      }
    },
    { requireAuth: true }
  );
}
