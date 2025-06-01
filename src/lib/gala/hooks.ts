import { useEffect, useState } from 'react';
import { Booking, SeatStatus, SelectedSeat, Table, UserBooking } from './types';

interface UseGalaSeatingProps {
  initialTables: Table[];
  userId?: string;
}

export function useGalaSeating({ initialTables, userId }: UseGalaSeatingProps) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetch('/api/gala-seating');
        const data = await res.json();

        // Handle both response formats
        const bookings = Array.isArray(data) ? data : data.allBookings || [];

        if (!Array.isArray(bookings)) {
          console.error('Unexpected bookings format:', bookings);
          return;
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
                const booking = bookings.find(
                  (b) => b.table === table.id && b.seat === seatNumber
                );
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
    }

    loadBookings();
  }, [userId]);

  const handleSeatClick = (table: number, seat: number, status: SeatStatus) => {
    if (status === 'booked') return;

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

      if (!res.ok) throw new Error('Booking failed');

      // Update local state
      setTables((prev) =>
        prev.map((t) => ({
          ...t,
          seats: t.seats.map((s) => ({
            ...s,
            status: selectedSeats.some((sel) => sel.tableId === t.id && sel.seatNumber === s.number)
              ? 'booked'
              : s.status,
          })),
        }))
      );

      setSelectedSeats([]);
      return true;
    } catch (error) {
      console.error('Booking error:', error);
      return false;
    }
  };

  const deleteBooking = async (tableId: number, seatNumber: number) => {
    try {
      const res = await fetch('/api/gala-seating', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: tableId, seat: seatNumber }),
      });

      if (!res.ok) throw new Error('Delete failed');

      // Update local state
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableId
            ? {
                ...t,
                seats: t.seats.map((s) =>
                  s.number === seatNumber ? { ...s, status: 'available' } : s
                ),
              }
            : t
        )
      );

      // Remove from user bookings if present
      setUserBookings((prev) =>
        prev.filter((b) => !(b.tableId === tableId && b.seatNumber === seatNumber))
      );

      return true;
    } catch (error) {
      console.error('Delete booking error:', error);
      return false;
    }
  };

  return {
    tables,
    selectedSeats,
    loading,
    userBookings,
    handleSeatClick,
    handleTableClick,
    submitBooking,
  };
}
