'use server';

import { supabaseServer } from '@/lib/supabase';
import type { BasicUser } from '@/types/user';
import { isOwnUserOrAdmin } from '@/utils/authorization';


/**
 * Get User Profile by Kinde User ID. This function is used at the onboarding check layer.
 */
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
      return null;
    }
    throw error;
  }

  return data;
}

export async function createUserProfile(userData: BasicUser) {
  if (!userData.kinde_id) {
    throw new Error('User ID is required');
  }

  // Check if user already exists
  const existingUser = await getUserProfile(userData.kinde_id);
  if (existingUser) {
    throw new Error('User profile already exists');
  }

  const { data, error } = await supabaseServer
    .from('users')
    .insert([
      {
        kinde_id: userData.kinde_id,
        kinde_email: userData.kinde_email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        entity: userData.entity,
        position: userData.position,
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

export async function getBasicInfoProfile(kindeUserId: string) {
  if (!kindeUserId) {
    throw new Error('User ID is required');
  }

  await isOwnUserOrAdmin(kindeUserId);

  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .eq('kinde_id', kindeUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

export async function updateUserProfile(
  kindeUserId: string,
  userData: Omit<BasicUser, 'kinde_id' | 'kinde_email'>
) {
  if (!kindeUserId) {
    throw new Error('User ID is required');
  }
  await isOwnUserOrAdmin(kindeUserId);

  const { data, error } = await supabaseServer
    .from('users')
    .update(userData)
    .eq('kinde_id', kindeUserId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
