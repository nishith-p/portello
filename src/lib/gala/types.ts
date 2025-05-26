export type SeatStatus = "available" | "selected" | "booked"

export interface Seat {
  id: string
  number: number
  status: SeatStatus
}

export interface Table {
  id: number
  name: string
  seats: Seat[]
}

export interface GalaSeating {
  table: number
  seat: number
  chief_delegate_id: string
}

export interface BookingSummary {
  tableId: number
  seatId: string
  seatNumber: number
}
