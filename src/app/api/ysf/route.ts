import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/lib/core/errors';
import { getYSFSelectionByEmail, createYSFSelection, getAllYSFStats, checkInternalUser } from '@/lib/ysf/db';
import { TRACK1, TRACK2, PANELS } from '@/app/(public)/ysf/const-ysf-tracks';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const statsOnly = url.searchParams.get('statsOnly') === 'true';

    if (statsOnly) {
      const stats = await getAllYSFStats();
      return NextResponse.json(stats);
    }

    if (!email) {
      return NextResponse.json(
        { error: { message: 'Email is required' } },
        { status: 400 }
      );
    }

    const [stats, selectionInfo] = await Promise.all([
      getAllYSFStats(),
      getYSFSelectionByEmail(email),
    ]);

    return NextResponse.json({
      ...stats,
      selections: selectionInfo.selections,
      hasSubmitted: selectionInfo.hasSubmitted,
      full_name: selectionInfo.full_name,
      internal: selectionInfo.internal,
    });
  } catch (error) {
    console.error('Error in GET /api/ysf:', error);
    return errorResponse(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { track1, track2, panel, full_name, email } = body;

    if (!email) {
      return NextResponse.json(
        { error: { message: 'Email is required' } },
        { status: 400 }
      );
    }

    if (!track1 || !track2 || !panel || !full_name) {
      return NextResponse.json(
        { error: { message: 'All selections and full name are required' } },
        { status: 400 }
      );
    }

    // Check if user has already submitted
    const selectionInfo = await getYSFSelectionByEmail(email);
    if (selectionInfo.hasSubmitted) {
      return NextResponse.json(
        { error: { message: 'You have already submitted your selections' } },
        { status: 403 }
      );
    }

    // Check if email exists in users table
    const isInternal = await checkInternalUser(email);

    // Get current stats to check availability
    const stats = await getAllYSFStats();
    
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

    // Create new selection with internal flag
    await createYSFSelection(email, { track1, track2, panel, full_name }, isInternal);

    return NextResponse.json({ success: true, internal: isInternal });
  } catch (error) {
    console.error('Error in POST /api/ysf:', error);
    return errorResponse(error as Error);
  }
}
