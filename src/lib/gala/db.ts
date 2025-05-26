
import { supabaseServer } from "../core/supabase"
import { GalaSeating } from "./types"

export async function getBookedSeats(): Promise<GalaSeating[]> {
  const { data, error } = await supabaseServer
    .from("gala_seating")
    .select("*")
    .not("chief_delegate_id", "is", null)

  if (error) {
    console.error("Error fetching booked seats:", error)
    return []
  }

  return data || []
}

export async function bookSeats(bookings: GalaSeating[]) {
  const { data, error } = await supabaseServer
    .from("gala_seating")
    .upsert(bookings, { onConflict: 'table,seat' })
    .select()

  if (error) {
    console.error("Error booking seats:", error)
    throw error
  }

  return data
}
