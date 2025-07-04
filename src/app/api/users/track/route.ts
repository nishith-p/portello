import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { getAllTrackStats, getUserSelectionInfo, updateUserSelections } from '@/lib/users/db';
import { TRACK1, TRACK2, PANELS } from '@/app/(portal)/(components)/user-dashboard/const-ysf-tracks';

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
          const stats = await getAllTrackStats();
          return NextResponse.json(stats);
        }

        const [stats, selectionInfo] = await Promise.all([
          getAllTrackStats(),
          getUserSelectionInfo(user.id),
        ]);

        return NextResponse.json({
          ...stats,
          selections: selectionInfo.selections,
          hasSubmitted: selectionInfo.hasSubmitted
        });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true }
  );
}

export async function PATCH(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user?.id) {
          throw new Error('User ID not found in authentication');
        }

        const body = await req.json();
        const { track1, track2, panel } = body;

        // Validate input
        if (!track1 || !track2 || !panel) {
          return NextResponse.json(
            { error: { message: 'All selections are required' } },
            { status: 400 }
          );
        }

        // Check if user has already submitted
        const selectionInfo = await getUserSelectionInfo(user.id);
        if (selectionInfo.hasSubmitted) {
          return NextResponse.json(
            { error: { message: 'Selections have already been submitted and cannot be changed' } },
            { status: 403 }
          );
        }

        // Get current stats to check availability
        const stats = await getAllTrackStats();
        
        // Check track 1 availability
        const track1Item = TRACK1.find(t => t.id === track1);
        const track1Limit = track1Item?.maxSlots || 0;
        if (stats.track1Stats[track1] >= track1Limit) {
          return NextResponse.json(
            { error: { message: 'Workshop 1 selection is currently full' } },
            { status: 400 }
          );
        }

        // Check track 2 availability
        const track2Item = TRACK2.find(t => t.id === track2);
        const track2Limit = track2Item?.maxSlots || 0;
        if (stats.track2Stats[track2] >= track2Limit) {
          return NextResponse.json(
            { error: { message: 'Workshop 2 selection is currently full' } },
            { status: 400 }
          );
        }

        // Check panel availability
        const panelItem = PANELS.find(p => p.id === panel);
        const panelLimit = panelItem?.maxSlots || 0;
        if (stats.panelStats[panel] >= panelLimit) {
          return NextResponse.json(
            { error: { message: 'Panel selection is currently full' } },
            { status: 400 }
          );
        }

        // Update selections
        await updateUserSelections(user.id, { track1, track2, panel });

        return NextResponse.json({ success: true });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true }
  );
}
