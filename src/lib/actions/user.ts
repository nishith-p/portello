'use server';

import { supabaseServer } from '@/lib/supabase';
import type { BasicUser } from '@/types/user';
import { u } from 'framer-motion/dist/types.d-6pKw1mTI';

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
        aiesec_email: userData.aiesec_email,
        personal_email: userData.personal_email,
        country_code: userData.country_code,
        phone_number: userData.phone_number,
        telegram_id: userData.telegram_id,
        region: userData.region,
        entity: userData.entity,
        lc: userData.lc,
        position: userData.position,
        tshirt_size: userData.tshirt_size,
        meal_preferences: userData.meal_preferences,
        allergies: userData.allergies,
        medical_concerns: userData.medical_concerns,
        expectations: userData.expectations,
        expectations_for_cc_faci: userData.expectations_for_cc_faci,
        post_conference_tour: userData.post_conference_tour,
        ai_partner_consent: userData.ai_partner_consent,
        promotional_consent: userData.promotional_consent,
        excitement: userData.excitement,
        other_message: userData.other_message,
        clarifications: userData.clarifications,
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
