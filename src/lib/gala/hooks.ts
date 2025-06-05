import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { SeatStatus, SelectedSeat, Table, UserBooking } from './types';

interface UseGalaSeatingProps {
  initialTables: Table[];
  userId?: string;
}

export function useGalaSeating({ initialTables, userId }: UseGalaSeatingProps) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [maxSeatsAllowed, setMaxSeatsAllowed] = useState<number | undefined>(undefined);
  const [isChiefDelegate, setIsChiefDelegate] = useState<boolean>(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gala-seating');
      const data = await res.json();

      if (data.isChiefDelegate !== undefined) {
        setIsChiefDelegate(data.isChiefDelegate);
      }

      // Handle both response formats
      const bookings = Array.isArray(data) ? data : data.allBookings || [];
      const maxSeats = data.maxSeatsAllowed;

      if (!Array.isArray(bookings)) {
        console.error('Unexpected bookings format:', bookings);
        return;
      }

      // Set the maximum seats allowed for this user
      if (maxSeats !== undefined) {
        setMaxSeatsAllowed(maxSeats);
      }

      // Find all of the user's bookings
      if (userId) {
        const userBookedSeats = bookings.filter((b) => b.chief_delegate_id === userId);
        const bookingsWithNames = userBookedSeats.map((booking) => {
          const table = initialTables.find((t) => t.id === booking.table);
          return {
            tableId: booking.table,
            seatNumber: booking.seat,
            tableName: table?.name || `Table ${booking.table}`,
          };
        });
        setUserBookings(bookingsWithNames);
      }

      setTables((prev) =>
        prev.map((table) => ({
          ...table,
          seats: Array(10)
            .fill(null)
            .map((_, i) => {
              const seatNumber = i + 1;
              const booking = bookings.find((b) => b.table === table.id && b.seat === seatNumber);
              return {
                number: seatNumber,
                status: booking ? 'booked' : 'available',
                bookedByUser: booking?.chief_delegate_id === userId,
              };
            }),
        }))
      );
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userId]);

  const handleSeatClick = (table: number, seat: number, status: SeatStatus) => {
    if (status === 'booked') return;

    // Check if selecting this seat would exceed the limit
    const totalBooked = userBookings.length;
    const totalSelected = selectedSeats.length;
    const isCurrentlySelected = selectedSeats.some(
      (s) => s.tableId === table && s.seatNumber === seat
    );

    if (!isCurrentlySelected && maxSeatsAllowed !== undefined) {
      const newTotal = totalBooked + totalSelected + 1;
      if (newTotal > maxSeatsAllowed) {
        return; // Don't allow selection if it would exceed the limit
      }
    }

    setSelectedSeats((prev) => {
      const existingIndex = prev.findIndex((s) => s.tableId === table && s.seatNumber === seat);

      if (existingIndex >= 0) {
        // Deselect seat
        return prev.filter((s) => !(s.tableId === table && s.seatNumber === seat));
      }
      // Select seat
      return [...prev, { tableId: table, seatNumber: seat }];
    });

    setTables((prev) =>
      prev.map((t) =>
        t.id === table
          ? {
              ...t,
              seats: t.seats.map((s) =>
                s.number === seat
                  ? {
                      ...s,
                      status: s.status === 'selected' ? 'available' : 'selected',
                    }
                  : s
              ),
            }
          : t
      )
    );
  };

  const handleTableClick = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    // Get all available and selected seats in this table
    const selectableSeats = table.seats.filter(
      (seat) => seat.status === 'available' || seat.status === 'selected'
    );

    // Check if all selectable seats are already selected
    const allAlreadySelected = selectableSeats.every((seat) => seat.status === 'selected');

    // Check if selecting all seats would exceed the limit
    if (!allAlreadySelected && maxSeatsAllowed !== undefined) {
      const totalBooked = userBookings.length;
      const currentSelectedFromOtherTables = selectedSeats.filter(
        (s) => s.tableId !== tableId
      ).length;
      const newTotal = totalBooked + currentSelectedFromOtherTables + selectableSeats.length;

      if (newTotal > maxSeatsAllowed) {
        return; // Don't allow selection if it would exceed the limit
      }
    }

    setSelectedSeats((prev) => {
      if (allAlreadySelected) {
        // Deselect all seats from this table
        return prev.filter((s) => s.tableId !== tableId);
      } else {
        // Remove existing selections from this table
        const otherSelections = prev.filter((s) => s.tableId !== tableId);
        // Add all selectable seats from this table
        const newSelections = selectableSeats.map((seat) => ({
          tableId,
          seatNumber: seat.number,
        }));
        return [...otherSelections, ...newSelections];
      }
    });

    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              seats: t.seats.map((s) => ({
                ...s,
                status:
                  allAlreadySelected && s.status === 'selected'
                    ? 'available'
                    : s.status === 'available' || s.status === 'selected'
                      ? 'selected'
                      : s.status,
              })),
            }
          : t
      )
    );
  };

  const submitBooking = async () => {
    if (!selectedSeats.length) return false;

    try {
      const bookings = selectedSeats.map((seat) => ({
        table: seat.tableId,
        seat: seat.seatNumber,
      }));

      const res = await fetch('/api/gala-seating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookings),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      // Clear selected seats immediately for better UX
      setSelectedSeats([]);

      // Refetch all data to ensure consistency
      await loadBookings();

      return true;
    } catch (error) {
      console.error('Booking error:', error);
      notifications.show({
        title: 'Booking Error',
        message: error instanceof Error ? error.message : 'Booking failed',
        color: 'red',
      });
      return false;
    }
  };

  return {
    tables,
    selectedSeats,
    loading,
    userBookings,
    maxSeatsAllowed,
    currentlyBooked: userBookings.length,
    isChiefDelegate,
    handleSeatClick,
    handleTableClick,
    submitBooking,
    refreshData: loadBookings,
  };
}
