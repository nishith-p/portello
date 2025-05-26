import { supabaseServer } from "../core/supabase";
import { Booking } from "./types";

export async function getBookedSeats(): Promise<Booking[]> {
  const { data, error } = await supabaseServer
    .from("gala_seating")
    .select("table, seat, chief_delegate_id")
    .not("chief_delegate_id", "is", null);

  if (error) {
    console.error("Error fetching booked seats:", error);
    return [];
  }

  return data || [];
}

export async function bookSeats(bookings: Booking[]) {
  const { data, error } = await supabaseServer
    .from("gala_seating")
    .upsert(bookings)
    .select();

  if (error) {
    console.error("Error booking seats:", error);
    throw error;
  }

  return data;
}
