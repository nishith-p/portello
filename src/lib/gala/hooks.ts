import { useEffect, useState } from 'react';
import { BookingSummary, Table } from './types';

interface UseGalaSeatingProps {
  initialTables: Table[];
}

export function useGalaSeating({ initialTables }: UseGalaSeatingProps) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedSeats, setSelectedSeats] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookedSeats() {
      try {
        const response = await fetch('/api/gala-seating');
        const bookedSeats = await response.json();

        setTables((prevTables) => {
          return prevTables.map((table) => {
            const bookedSeatsForTable = bookedSeats.filter(
              (seat: any) => seat.table_id === table.id
            );

            const seats = table.seats.map((seat) => {
              const isBooked = bookedSeatsForTable.some(
                (bookedSeat: any) => bookedSeat.seat_id === seat.id
              );
              return {
                ...seat,
                status: isBooked ? 'booked' : seat.status,
              };
            });

            return {
              ...table,
              seats,
            };
          });
        });
      } catch (error) {
        console.error('Failed to fetch booked seats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookedSeats();
  }, []);

  const handleSeatClick = (tableId: number, seatId: string, seatNumber: number, status: string) => {
    if (status === 'booked') return;

    const seatIndex = selectedSeats.findIndex((seat) => seat.seatId === seatId);

    if (seatIndex > -1) {
      // Deselect seat
      setSelectedSeats((prev) => prev.filter((seat) => seat.seatId !== seatId));
      updateSeatStatus(tableId, seatId, 'available');
    } else {
      // Select seat
      setSelectedSeats((prev) => [...prev, { tableId, seatId, seatNumber }]);
      updateSeatStatus(tableId, seatId, 'selected');
    }
  };

  const updateSeatStatus = (
    tableId: number,
    seatId: string,
    status: 'available' | 'selected' | 'booked'
  ) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              seats: table.seats.map((seat) => (seat.id === seatId ? { ...seat, status } : seat)),
            }
          : table
      )
    );
  };

  const submitBooking = async () => {
    try {
      const response = await fetch("/api/gala-seating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedSeats.map((seat) => ({
            tableId: seat.tableId,
            seatId: seat.seatId
          }))
        ),
      })

      if (!response.ok) throw new Error("Booking failed")

      // Update local state to mark seats as booked
      selectedSeats.forEach((seat) => {
        updateSeatStatus(seat.tableId, seat.seatId, "booked")
      })

      setSelectedSeats([])
      return true
    } catch (error) {
      console.error("Booking error:", error)
      return false
    }
  }

  return {
    tables,
    selectedSeats,
    loading,
    handleSeatClick,
    submitBooking,
  };
}
