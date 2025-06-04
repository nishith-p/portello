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

export async function getUserEntityCount(userId: string): Promise<number> {
  const { data: userData, error: userError } = await supabaseServer
    .from('users')
    .select('entity')
    .eq('kinde_id', userId)
    .single();

  if (userError || !userData?.entity) {
    console.error('Error fetching user entity:', userError);
    return 0;
  }

  const { count, error: countError } = await supabaseServer
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('entity', userData.entity);

  if (countError) {
    console.error('Error fetching entity count:', countError);
    return 0;
  }

  return count || 0;
}
