import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { BadRequestError, errorResponse } from '@/lib/core/errors';
import { createStoreItem, getActiveStoreItems } from '@/lib/store/items/db';
import { StoreItemInput } from '@/lib/store/types';

/**
 * GET /api/store/items
 * - Public: Get active store items
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withAuth(
    request,
    async () => {
      try {
        // Return active items for public store
        const items = await getActiveStoreItems();
        return NextResponse.json({ items, total: items.length });
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: false } // Allow public access for viewing store items
  );
}

/**
 * POST /api/store/items
 * - Admin only: Create a new store item
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  return withAuth(
    request,
    async (req) => {
      try {
        const body = await req.json();

        // Validate input
        if (!body || typeof body !== 'object') {
          throw new BadRequestError('Invalid request body');
        }

        const itemData: StoreItemInput = {
          item_code: body.item_code,
          name: body.name,
          price: body.price,
          images: body.images || [],
          sizes: body.sizes || [],
          colors: body.colors || [],
          description: body.description,
          active: body.active !== undefined ? body.active : true,
        };

        const newItem = await createStoreItem(itemData);
        return NextResponse.json(newItem, { status: 201 });
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}
