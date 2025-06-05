import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { getUsersByRoom } from '@/lib/users/db';

/**
 * GET /api/users/room/[roomNo]
 * Get all users from a specific room
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { roomNo: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        // Check if we have a user ID from authentication
        if (!user?.id) {
          throw new Error('User ID not found in authentication');
        }

        const { roomNo } = params;
        
        if (!roomNo) {
          return NextResponse.json(
            { error: { message: 'Room number is required' } },
            { status: 400 }
          );
        }

        // Decode the room number in case it contains special characters
        const decodedRoomNo = decodeURIComponent(roomNo);
        
        const users = await getUsersByRoom(decodedRoomNo);
        
        return NextResponse.json({ users });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true }
  );
}
