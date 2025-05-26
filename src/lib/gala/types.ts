export type SeatStatus = "available" | "selected" | "booked";

export interface Seat {
  number: number;
  status: SeatStatus;
}

export interface Table {
  id: number;
  name: string;
  seats: Seat[];
}

export interface Booking {
  table: number;
  seat: number;
  chief_delegate_id?: string;
}

export interface SelectedSeat {
  tableId: number;
  seatNumber: number;
}

export interface UserBooking {
  tableId: number;
  seatNumber: number;
  tableName: string;
}
