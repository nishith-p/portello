import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { getActiveConsumableItems, getActiveNonConsumableItems } from '@/lib/store/items/db';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withAuth(
    request,
    async () => {
      try {
        const [consumables, nonConsumables] = await Promise.all([
          getActiveConsumableItems(),
          getActiveNonConsumableItems()
        ]);
        
        return NextResponse.json({ 
          consumables, 
          nonConsumables,
          success: true 
        });
      } catch (error) {
        console.error('Error in consumables API:', error);
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: false }
  );
}