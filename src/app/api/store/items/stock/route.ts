// app/api/store/items/stock/route.ts
import { getStoreItemStock } from '@/lib/store/items/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemCode = searchParams.get('item_code');
  const color = searchParams.get('color');
  const size = searchParams.get('size');

  if (!itemCode) {
    return NextResponse.json(
      { error: { message: 'Item code is required' } },
      { status: 400 }
    );
  }

  try {
    const stock = await getStoreItemStock(itemCode, color || undefined, size || undefined);
    return NextResponse.json({ stock });
  } catch (error) {
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : 'Failed to fetch stock' } },
      { status: 500 }
    );
  }
}
