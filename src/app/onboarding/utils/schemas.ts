import { BasicUser } from '@/types/user';

export const onboardingFormValidation = {
  first_name: (value: string) => (value.trim().length < 2 ? 'First name is too short' : null),
  last_name: (value: string) => (value.trim().length < 2 ? 'Last name is too short' : null),
  entity: (value: string) => (!value ? 'Please select your entity' : null),
};

export const initialOnboardingFormValues: Omit<BasicUser, 'kinde_id' | 'kinde_email'> = {
  first_name: '',
  last_name: '',
  entity: '',
  aiesec_email: '',
  personal_email: '',
  country_code: '',
  phone_number: '',
  telegram_id: '',
  lc: '',
  allergies: '',
  medical_concerns: '',
  expectations: '',
  expectations_for_cc_faci: '',
  post_conference_tour: false,
  ai_partner_consent: false,
  promotional_consent: false,
  excitement: 0,
  other_message: '',
  clarifications: ''
};
