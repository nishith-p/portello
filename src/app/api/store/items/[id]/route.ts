import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { BadRequestError, errorResponse, NotFoundError } from '@/lib/core/errors';
import { getStoreItemById, updateStoreItem, updateStoreItemStatus } from '@/lib/store/items/db';
import { StoreItemInput } from '@/lib/store/types';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/store/items/[id]
 * - Public: Get a specific store item by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  return withAuth(
    request,
    async () => {
      try {
        const id = params.id;

        // Get the specific item by ID
        const item = await getStoreItemById(id);

        if (!item) {
          throw new NotFoundError('Store item not found');
        }

        return NextResponse.json(item);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: false }
  );
}

/**
 * PUT /api/store/items/[id]
 * - Admin only: Update an existing store item
 */
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  return withAuth(
    request,
    async (req) => {
      try {
        const id = params.id;
        const body = await req.json();

        // Validate input
        if (!body || typeof body !== 'object') {
          throw new BadRequestError('Invalid request body');
        }

        const itemData: Partial<StoreItemInput> = {};

        // Only include fields that were provided in the request
        if (body.item_code !== undefined) {
          itemData.item_code = body.item_code;
        }
        if (body.name !== undefined) {
          itemData.name = body.name;
        }
        if (body.price !== undefined) {
          itemData.price = body.price;
        }
        if (body.images !== undefined) {
          itemData.images = body.images;
        }
        if (body.sizes !== undefined) {
          itemData.sizes = body.sizes;
        }
        if (body.colors !== undefined) {
          itemData.colors = body.colors;
        }
        if (body.description !== undefined) {
          itemData.description = body.description;
        }
        if (body.active !== undefined) {
          itemData.active = body.active;
        }
        if (body.pre_price !== undefined) {
          itemData.pre_price = body.pre_price;
        }
        if (body.discount_perc !== undefined) {
          itemData.discount_perc = body.discount_perc;
        }

        const updatedItem = await updateStoreItem(id, itemData);
        return NextResponse.json(updatedItem);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}

/**
 * PATCH /api/store/items/[id]
 * - Admin only: Update a store item's status
 */
export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  return withAuth(
    request,
    async (req) => {
      try {
        const id = params.id;
        const body = await req.json();

        // Validate input
        if (!body || typeof body !== 'object' || body.active === undefined) {
          throw new BadRequestError('Invalid request body, missing active status');
        }

        const active = Boolean(body.active);
        const updatedItem = await updateStoreItemStatus(id, active);

        return NextResponse.json(updatedItem);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}

/**
 * DELETE /api/store/items/[id]
 * - Admin only: Deactivate a store item (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  return withAuth(
    request,
    async () => {
      try {
        const id = params.id;

        // We use updateStoreItemStatus to deactivate the item as a soft delete
        const updatedItem = await updateStoreItemStatus(id, false);

        return NextResponse.json(updatedItem);
      } catch (error) {
        return errorResponse(error instanceof Error ? error : new Error(String(error)));
      }
    },
    { requireAuth: true, requireAdmin: true }
  );
}
