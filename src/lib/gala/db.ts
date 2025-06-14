import { supabaseServer } from '../core/supabase';
import { AdminGalaData, Booking, EntityBooking } from './types';

export async function getBookedSeats(): Promise<Booking[]> {
  const { data, error } = await supabaseServer
    .from('gala_seating')
    .select('table, seat, kinde_id')
    .not('kinde_id', 'is', null);

  if (error) {
    console.error('Error fetching booked seats:', error);
    return [];
  }

  return data || [];
}

export async function bookSeats(bookings: Booking[]) {
  const { data, error } = await supabaseServer.from('gala_seating').upsert(bookings).select();

  if (error) {
    console.error('Error booking seats:', error);
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

export async function isChiefDelegate(userId: string): Promise<boolean> {
  const { data, error } = await supabaseServer
    .from('users')
    .select('is_chief_delegate')
    .eq('kinde_id', userId)
    .single();

  if (error || !data) {
    console.error('Error checking chief delegate status:', error);
    return false;
  }

  return data.is_chief_delegate || false;
}

// admin view
export async function getAdminGalaData(): Promise<AdminGalaData | null> {
  // Get all booked seats with user details
  const { data: bookings, error } = await supabaseServer
    .from('gala_seating')
    .select(`
      table, 
      seat, 
      kinde_id,
      users!inner(first_name, entity, is_chief_delegate)
    `)
    .not('kinde_id', 'is', null)
    .order('table')
    .order('seat');

  if (error || !bookings) {
    console.error('Error fetching admin gala seating:', error);
    return null;
  }

  // Convert Supabase response to our typed Booking format
  const typedBookings: Booking[] = bookings.map((booking: any) => {
    return {
      table: booking.table,
      seat: booking.seat,
      kinde_id: booking.kinde_id,
      users: booking.users ? {
        first_name: booking.users.first_name,
        entity: booking.users.entity,
        is_chief_delegate: booking.users.is_chief_delegate
      } : undefined
    };
  });

  console.log('Typed bookings:', typedBookings);

  // Get all entities with their delegate counts
  const { data: entityStats, error: entityError } = await supabaseServer
    .from('users')
    .select('entity')
    .not('entity', 'is', null);

  if (entityError || !entityStats) {
    console.error('Error fetching entity stats:', entityError);
    return null;
  }

  // Count delegates per entity
  const entityCounts: Record<string, number> = {};
  const allEntities = new Set<string>();
  
  entityStats.forEach((user: any) => {
    entityCounts[user.entity] = (entityCounts[user.entity] || 0) + 1;
    allEntities.add(user.entity);
  });

  // Group bookings by entity
  const bookingsByEntity: Record<string, EntityBooking> = {};

  // Initialize all entities (even those without bookings)
  allEntities.forEach(entity => {
    bookingsByEntity[entity] = {
      entity,
      bookedSeats: 0,
      maxSeats: entityCounts[entity] || 0,
      delegates: [],
    };
  });

  // Add booking data to entities
  typedBookings.forEach((booking) => {
    if (!booking.users?.entity) {
      console.warn(`No user/entity data found for booking: ${booking.kinde_id}`);
      return;
    }

    const entity = booking.users.entity;
    
    // Check if delegate already exists
    const existingDelegateIndex = bookingsByEntity[entity].delegates.findIndex(
      (d) => d.id === booking.kinde_id
    );

    if (existingDelegateIndex === -1) {
      // Add new delegate
      bookingsByEntity[entity].delegates.push({
        id: booking.kinde_id || '',
        name: booking.users.first_name || 'Unknown',
        seats: [{ table: booking.table, seat: booking.seat }],
        is_chief_delegate: booking.users.is_chief_delegate || false
      });
    } else {
      // Add seat to existing delegate
      bookingsByEntity[entity].delegates[existingDelegateIndex].seats.push({
        table: booking.table,
        seat: booking.seat,
      });
    }

    bookingsByEntity[entity].bookedSeats++;
  });

  // Calculate totals
  const totalSeatsBooked = typedBookings.length;
  const totalEntitiesBooked = Object.values(bookingsByEntity).filter(entity => entity.bookedSeats > 0).length;
  const totalEntitiesRegistered = allEntities.size;

  return {
    bookingsByEntity: Object.values(bookingsByEntity),
    totalSeatsBooked,
    totalEntitiesBooked,
    totalEntitiesRegistered,
    allBookings: typedBookings,
  };
}
