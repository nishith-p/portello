import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { searchStorePacks } from '@/lib/store/packs/db';
import { StorePackSearchParams } from '@/lib/store/types';

/**
 * GET /api/store/packs/search
 * - Admin only: Search and filter store packs with pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withAuth(
    request,
    async () => {
      try {
        const url = new URL(request.url);
        const params = url.searchParams;

        const searchParams: StorePackSearchParams = {
          search: params.get('search') || undefined,
          active: params.has('active') ? params.get('active') === 'true' : undefined,
          limit: params.has('limit') ? parseInt(params.get('limit') as string, 10) : 10,
          offset: params.has('offset') ? parseInt(params.get('offset') as string, 10) : 0,
        };

        const result = await searchStorePacks(searchParams);
        return NextResponse.json(result);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}
