import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { BadRequestError, errorResponse } from '@/lib/core/errors';
import { createStorePack, getActiveStorePacks } from '@/lib/store/packs/db';
import { StorePackWithItemsInput } from '@/lib/store/types';

/**
 * GET /api/store/packs
 * - Public: Get active store packs
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withAuth(
    request,
    async () => {
      try {
        // Return active packs for public store
        const packs = await getActiveStorePacks();
        return NextResponse.json({ packs, total: packs.length });
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: false }
  );
}

/**
 * POST /api/store/packs
 * - Admin only: Create a new store pack
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

        // Validate pack items
        if (!Array.isArray(body.pack_items) || body.pack_items.length === 0) {
          throw new BadRequestError('Pack must contain at least one item');
        }

        const packData: StorePackWithItemsInput = {
          pack_code: body.pack_code,
          name: body.name,
          description: body.description,
          images: body.images || [],
          price: body.price,
          active: body.active !== undefined ? body.active : true,
          pack_items: body.pack_items.map((item: any) => ({
            item_id: item.item_id,
            quantity: item.quantity,
          })),
          pre_price: body.pre_price || undefined,
          discount_perc: body.discount_perc || undefined,
        };

        const newPack = await createStorePack(packData);
        return NextResponse.json(newPack, { status: 201 });
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}
