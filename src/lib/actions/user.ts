'use server';

import { supabaseServer } from '@/lib/supabase';

export async function getUserProfile(kindeUserId: string) {
  if (!kindeUserId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .eq('kinde_id', kindeUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // User not found
    }
    throw error;
  }

  return data;
}

export async function createUserProfile(userData: {
  kindeUserId: string;
  firstName: string;
  lastName: string;
}) {
  if (!userData.kindeUserId) {
    throw new Error('User ID is required');
  }

  // Check if user already exists
  const existingUser = await getUserProfile(userData.kindeUserId);
  if (existingUser) {
    throw new Error('User profile already exists');
  }

  const { data, error } = await supabaseServer
    .from('users')
    .insert([
      {
        kinde_id: userData.kindeUserId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data, error: null };
}
