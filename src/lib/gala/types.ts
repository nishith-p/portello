export type SeatStatus = 'available' | 'selected' | 'booked';

export interface Seat {
  number: number;
  status: SeatStatus;
  bookedByUser?: boolean;
  entityCode?: string;
}

export interface Table {
  row: number;
  positionInRow: number;
  id: number;
  name: string;
  seats: Seat[];
}

export interface User {
  first_name: string;
  entity: string;
  is_chief_delegate?: boolean;
}

export interface Booking {
  table: number;
  seat: number;
  kinde_id?: string;
  users?: User;
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

export interface EntityBooking {
  entity: string;
  bookedSeats: number;
  maxSeats: number;
  delegates: {
    id: string;
    name: string;
    entity: string;
    seats: { table: number; seat: number }[];
    is_chief_delegate?: boolean;
  }[];
}

export interface AdminGalaData {
  bookingsByEntity: EntityBooking[];
  totalSeatsBooked: number;
  totalEntitiesBooked: number;
  totalEntitiesRegistered: number;
  allBookings: Booking[];
}

export interface TableStatus {
  id: number;
  name: string;
  seats: {
    number: number;
    status: 'available' | 'booked';
    entityCode?: string;
    delegateName?: string;
  }[];
  row: number;
  positionInRow: number;
}
