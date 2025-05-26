import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { bookSeats, getBookedSeats } from '@/lib/gala/db';
import { Booking } from '@/lib/gala/types';

export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const bookedSeats = await getBookedSeats();
      // Include user's booking status in response if authenticated
      if (user?.id) {
        const userBooking = bookedSeats.find(b => b.chief_delegate_id === user.id);
        return NextResponse.json({
          allBookings: bookedSeats,
          userBooking: userBooking || null
        });
      }
      return NextResponse.json({ allBookings: bookedSeats });
    },
    { requireAuth: false }
  );
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newBookings: Omit<Booking, 'chief_delegate_id'>[] = await request.json();

    const bookingsWithUser = newBookings.map(b => ({
      ...b,
      chief_delegate_id: user.id
    }));

    try {
      await bookSeats(bookingsWithUser);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json(
        { error: "Booking failed" }, 
        { status: 500 }
      );
    }
  });
}
