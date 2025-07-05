import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { BingoService } from '@/lib/bingo/db';

export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        const { activityId, completed } = await req.json();

        if (typeof activityId !== 'number' || typeof completed !== 'boolean') {
          return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        if (!user) {
          return NextResponse.json({ error: 'User is required' }, { status: 400 });
        }

        const data = await BingoService.saveActivity(user, activityId, completed);
        return NextResponse.json(data);
      } catch (error: any) {
        console.error('Save activity error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to save activity' },
          { status: 500 }
        );
      }
    },
    { requireAuth: true }
  );
}
