export type BasicUser = {
  kinde_id: string;
  kinde_email: string;
  first_name: string;
  last_name: string;
  aiesec_email: string;
  personal_email: string;
  country_code: string;
  phone_number: string;
  telegram_id: string;
  region?: 'asia_pacific' | 'europe' | 'middle_east_africa' | 'americas';
  entity: string;
  lc: string;
  position?: 'mcp' | 'mcvp' | 'lcp' | 'other';
  tshirt_size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  meal_preferences?: 'veg' | 'non_veg' | 'halal' | 'other';
  allergies: string;
  medical_concerns: string;
  expectations: string;
  expectations_for_cc_faci: string;
  post_conference_tour: boolean;
  ai_partner_consent: boolean;
  promotional_consent: boolean;
  excitement: number;
  other_message: string;
  clarifications: string;
  status?: 'pending' | 'active' | 'suspended';
}

