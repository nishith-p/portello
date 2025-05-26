import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { bookSeats, getBookedSeats } from '@/lib/gala/db';
import { GalaSeating } from '@/lib/gala/types';
import { ValidationError } from '@/lib/core/errors';

export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const bookedSeats = await getBookedSeats();
      return NextResponse.json(bookedSeats);
    },
    { requireAuth: false }
  ); // Allow unauthenticated users to see seating
}

export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      if (!user || !user.id) {
        throw new ValidationError('User is required', { user: 'User ID is required' });
      }
      const bookings: Pick<GalaSeating, 'table' | 'seat'>[] = await request.json();

      // Add user ID to each booking
      const bookingsWithUser = bookings.map((booking) => ({
        ...booking,
        chief_delegate_id: user.id,
      }));

      try {
        const result = await bookSeats(bookingsWithUser);
        return NextResponse.json(result);
      } catch (error) {
        return NextResponse.json({ error: 'Failed to book seats' }, { status: 500 });
      }
    },
    { requireAuth: true }
  ); // Require authentication for booking
}
