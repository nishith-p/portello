import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { getUserStats } from '@/lib/users/stats/db';

/**
 * GET /api/users/stats
 * Get comprehensive user statistics (admin only)
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async () => {
      try {
        const stats = await getUserStats();
        return NextResponse.json(stats);
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    {
      requireAuth: true,
      requireAdmin: true,
    }
  );
}
