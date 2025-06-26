import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { getTrackStats, updateUserTrack, getUserTrackInfo } from '@/lib/users/db';

/**
 * GET /api/users/track
 * Get track statistics and user's current track info
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user?.id) {
          throw new Error('User ID not found in authentication');
        }

        const url = new URL(req.url);
        const statsOnly = url.searchParams.get('statsOnly') === 'true';

        if (statsOnly) {
          // Return only track statistics
          const trackStats = await getTrackStats();
          return NextResponse.json({ trackStats });
        }

        // Return both track statistics and user's track info
        const [trackStats, userTrackInfo] = await Promise.all([
          getTrackStats(),
          getUserTrackInfo(user.id),
        ]);

        return NextResponse.json({
          trackStats,
          userTrack: userTrackInfo.track,
          hasSubmitted: userTrackInfo.hasSubmitted,
        });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true }
  );
}

/**
 * PATCH /api/users/track
 * Update user's track selection
 */
export async function PATCH(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user?.id) {
          throw new Error('User ID not found in authentication');
        }

        const body = await req.json();
        const { track } = body;

        // Validate input
        if (!track || typeof track !== 'string') {
          return NextResponse.json(
            { error: { message: 'Track is required and must be a string' } },
            { status: 400 }
          );
        }

        // Check if user has already submitted a track
        const userTrackInfo = await getUserTrackInfo(user.id);
        if (userTrackInfo.hasSubmitted) {
          return NextResponse.json(
            { error: { message: 'Track selection has already been submitted and cannot be changed' } },
            { status: 403 }
          );
        }

        // Get current track stats to check availability
        const trackStats = await getTrackStats();
        
        // Define track limits
        const trackLimits: Record<string, number> = {
          employability: 50,
          leadership: 40,
          sustainability: 35,
          diversity: 30,
        };

        // Check if track is full
        const currentCount = trackStats[track] || 0;
        const maxCount = trackLimits[track];
        
        if (currentCount >= maxCount) {
          return NextResponse.json(
            { error: { message: 'This track is currently full. Please select another track.' } },
            { status: 400 }
          );
        }

        // Update user's track
        await updateUserTrack(user.id, track);

        return NextResponse.json({ success: true });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true }
  );
}
