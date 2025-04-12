import { NextRequest, NextResponse } from 'next/server';
import {
  createStoreItem,
  getActiveStoreItems,
  getStoreItemById,
  searchStoreItems,
  updateStoreItem,
  updateStoreItemStatus,
} from '@/lib/api/db/store-items';
import { BadRequestError, errorResponse, NotFoundError } from '@/lib/api/errors';
import { withAuth } from '@/lib/api/middleware/auth';
import { StoreItemInput, StoreItemSearchParams } from '@/types/store';

/**
 * GET /api/store/items
 * - Public: Get active store items
 * - Admin: Get all store items with search/filter/pagination
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req) => {
      try {
        const url = new URL(req.url);
        const itemId = url.searchParams.get('id');

        // If an ID is provided, return the specific item
        if (itemId) {
          const item = await getStoreItemById(itemId);
          if (!item) {
            throw new NotFoundError('Store item not found');
          }
          return NextResponse.json(item);
        }

        // Check if admin search parameters are provided
        const isAdminSearch =
          url.searchParams.has('offset') ||
          url.searchParams.has('limit') ||
          url.searchParams.has('search');

        if (isAdminSearch) {
          // Admin search with parameters
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
        }

        // Default: return active items for public store
        const items = await getActiveStoreItems();
        return NextResponse.json({ items, total: items.length });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: false } // Allow public access for viewing store items
  );
}

/**
 * POST /api/store/items
 * - Admin only: Create a new store item
 */
export async function POST(request: NextRequest) {
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
          active: body.active,
        };

        const newItem = await createStoreItem(itemData);
        return NextResponse.json(newItem, { status: 201 });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true, requireAdmin: true } // Admin only
  );
}

/**
 * PUT /api/store/items
 * - Admin only: Update an existing store item
 */
export async function PUT(request: NextRequest) {
  return withAuth(
    request,
    async (req) => {
      try {
        const body = await req.json();

        // Validate input
        if (!body || typeof body !== 'object' || !body.id) {
          throw new BadRequestError('Invalid request body or missing item ID');
        }

        const itemId = body.id;
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

        const updatedItem = await updateStoreItem(itemId, itemData);
        return NextResponse.json(updatedItem);
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true, requireAdmin: true } // Admin only
  );
}

/**
 * PATCH /api/store/items
 * - Admin only: Update a store item's status
 */
export async function PATCH(request: NextRequest) {
  return withAuth(
    request,
    async (req) => {
      try {
        const body = await req.json();

        // Validate input
        if (!body || typeof body !== 'object' || !body.id || body.active === undefined) {
          throw new BadRequestError('Invalid request body, missing id or active status');
        }

        const { id, active } = body;

        const updatedItem = await updateStoreItemStatus(id, active);
        return NextResponse.json(updatedItem);
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true, requireAdmin: true } // Admin only
  );
}
