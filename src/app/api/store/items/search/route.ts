import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { searchStoreItems } from '@/lib/store/items/db';
import { StoreItemSearchParams } from '@/lib/store/types';

/**
 * GET /api/store/items/search
 * - Admin only: Search and filter store items with pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withAuth(
    request,
    async (req) => {
      try {
        const url = new URL(req.url);

        // Extract search parameters
        const searchParams: StoreItemSearchParams = {
          search: url.searchParams.get('search') || undefined,
          active: url.searchParams.has('active')
            ? url.searchParams.get('active') === 'true'
            : undefined,
          limit: url.searchParams.get('limit')
            ? parseInt(url.searchParams.get('limit') as string, 10)
            : 10,
          offset: url.searchParams.get('offset')
            ? parseInt(url.searchParams.get('offset') as string, 10)
            : 0,
        };

        const result = await searchStoreItems(searchParams);
        return NextResponse.json(result);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}
