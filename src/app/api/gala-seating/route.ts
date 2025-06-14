import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { bookSeats, getBookedSeats, getUserEntityCount, isChiefDelegate } from '@/lib/gala/db';
import { Booking } from '@/lib/gala/types';

export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const bookedSeats = await getBookedSeats();

      // Include user's booking status and entity count in response if authenticated
      if (user?.id) {
        const isChief = await isChiefDelegate(user.id);
        if (!isChief) {
          return NextResponse.json(
            { error: 'Only chief delegates can book seats' },
            { status: 403 }
          );
        }

        const userBooking = bookedSeats.find((b) => b.kinde_id === user.id);
        const entityCount = await getUserEntityCount(user.id);

        return NextResponse.json({
          allBookings: bookedSeats,
          userBooking: userBooking || null,
          maxSeatsAllowed: entityCount,
          isChiefDelegate: isChief,
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newBookings: Omit<Booking, 'kinde_id'>[] = await request.json();

    // Get current user's entity count limit
    const maxSeatsAllowed = await getUserEntityCount(user.id);

    // Get current bookings for this user
    const currentBookings = await getBookedSeats();
    const userCurrentBookings = currentBookings.filter((b) => b.kinde_id === user.id);

    // Check if new bookings would exceed the limit
    const totalSeatsAfterBooking = userCurrentBookings.length + newBookings.length;

    if (totalSeatsAfterBooking > maxSeatsAllowed) {
      return NextResponse.json(
        {
          error: `Booking would exceed your limit of ${maxSeatsAllowed} seats (${userCurrentBookings.length} already booked)`,
        },
        { status: 400 }
      );
    }

    const bookingsWithUser = newBookings.map((b) => ({
      ...b,
      kinde_id: user.id,
    }));

    try {
      await bookSeats(bookingsWithUser);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
    }
  });
}
