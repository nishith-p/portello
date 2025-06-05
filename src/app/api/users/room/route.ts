import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { getUsersByRoom } from '@/lib/users/db';

/**
 * GET /api/users/room?roomNo=123
 * Get all users from a specific room
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        // Check if we have a user ID from authentication
        if (!user?.id) {
          throw new Error('User ID not found in authentication');
        }

        const url = new URL(req.url);
        const roomNo = url.searchParams.get('roomNo');
        
        if (!roomNo) {
          return NextResponse.json(
            { error: { message: 'Room number is required' } },
            { status: 400 }
          );
        }

        const users = await getUsersByRoom(roomNo);
        
        return NextResponse.json({ users });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true }
  );
}
