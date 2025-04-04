import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, errorResponse } from '@/app/api/utils/auth';
import { createStoreItem, getStoreItems } from '@/app/api/utils/db';

// GET /api/store/items - Get all items
// Use ?includeInactive=true query param to include inactive items (admin only)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // If includeInactive is true, verify admin permissions
    if (includeInactive) {
      try {
        await isAdmin();
      } catch (error) {
        // If not admin, ignore the includeInactive parameter
        const items = await getStoreItems(false);
        return NextResponse.json(items);
      }
    }

    const items = await getStoreItems(includeInactive);
    return NextResponse.json(items);
  } catch (error) {
    return errorResponse(error as Error);
  }
}

// POST /api/store/items - Create a new item (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await isAdmin();

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['item_code', 'name', 'price', 'images', 'sizes', 'colors', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Create item
    const newItem = await createStoreItem(body);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return errorResponse(
      error as Error,
      (error as Error).message === 'Unauthorized' ? 403 : 400
    );
  }
}