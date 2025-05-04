// File: app/api/store/orders/items/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { getItemQuantities } from '@/lib/store/orders/db';

/**
 * GET /api/orders/items
 * Get all item quantities (admin only)
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async () => {
      try {
        const itemQuantities = await getItemQuantities();
        return NextResponse.json(itemQuantities);
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