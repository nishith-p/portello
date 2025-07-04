import { NextResponse } from 'next/server';
import { getDaysWithData } from '@/lib/agenda/db';

export async function GET() {
  try {
    const days = await getDaysWithData();
    return NextResponse.json(days);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agenda data' },
      { status: 500 }
    );
  }
}
