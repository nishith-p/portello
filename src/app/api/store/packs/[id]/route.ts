import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { RouteContext } from '@/lib/common-types';
import { BadRequestError, errorResponse, NotFoundError } from '@/lib/core/errors';
import {
  getStorePackById,
  updatePackItems,
  updateStorePack,
  updateStorePackItems,
  updateStorePackStatus,
} from '@/lib/store/packs/db';
import { StorePackInput, StorePackItemInput } from '@/lib/store/types';

/**
 * GET /api/store/packs/[id]
 * - Public: Get a specific store pack by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteContext['params']> }
): Promise<NextResponse> {
  return withAuth(
    request,
    async () => {
      try {
        const { id } = await context.params;

        const pack = await getStorePackById(id);

        if (!pack) {
          throw new NotFoundError('Store pack not found');
        }

        return NextResponse.json(pack);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: false }
  );
}

/**
 * PUT /api/store/packs/[id]
 * - Admin only: Update an existing store pack
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<RouteContext['params']> }
): Promise<NextResponse> {
  return withAuth(
    request,
    async (req) => {
      try {
        const { id } = await context.params;

        const body = await req.json();

        if (!body || typeof body !== 'object') {
          throw new BadRequestError('Invalid request body');
        }

        const packData: Partial<StorePackInput> = {};

        if (body.pack_code !== undefined) {
          packData.pack_code = body.pack_code;
        }
        if (body.name !== undefined) {
          packData.name = body.name;
        }
        if (body.description !== undefined) {
          packData.description = body.description;
        }
        if (body.images !== undefined) {
          packData.images = body.images;
        }
        if (body.price !== undefined) {
          packData.price = body.price;
        }
        if (body.active !== undefined) {
          packData.active = body.active;
        }
        if (body.pre_price !== undefined) {
          packData.pre_price = body.pre_price;
        }
        if (body.discount_perc !== undefined) {
          packData.discount_perc = body.discount_perc;
        }

        // If pack items are provided, update them separately
        let updatedPack = await updateStorePack(id, packData);

        // If pack items are included, update them as well
        if (Array.isArray(body.pack_items)) {
          const packItems: StorePackItemInput[] = await updatePackItems(id, body.pack_items.map((item: any) => ({
            item_id: item.item_id,
            quantity: item.quantity,
            is_optional: item.is_optional || false
          })));

          updatedPack = await updateStorePackItems(id, packItems);
        }

        return NextResponse.json(updatedPack);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}

/**
 * PATCH /api/store/packs/[id]
 * - Admin only: Update a store pack's status
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<RouteContext['params']> }
): Promise<NextResponse> {
  return withAuth(
    request,
    async (req) => {
      try {
        const { id } = await context.params;
        const body = await req.json();

        // Validate input
        if (!body || typeof body !== 'object' || body.active === undefined) {
          throw new BadRequestError('Invalid request body, missing active status');
        }

        const active = Boolean(body.active);
        const updatedPack = await updateStorePackStatus(id, active);

        return NextResponse.json(updatedPack);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}

/**
 * DELETE /api/store/packs/[id]
 * - Admin only: Deactivate a store pack (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<RouteContext['params']> }
): Promise<NextResponse> {
  return withAuth(
    request,
    async () => {
      try {
        const { id } = await context.params;

        const updatedPack = await updateStorePackStatus(id, false);

        return NextResponse.json(updatedPack);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}
