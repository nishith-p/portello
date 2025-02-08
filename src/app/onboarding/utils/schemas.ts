import { BasicUser } from '@/types/user';

export const onboardingFormValidation = {
  first_name: (value: string) => (value.trim().length < 2 ? 'First name is too short' : null),
  last_name: (value: string) => (value.trim().length < 2 ? 'Last name is too short' : null),
  entity: (value: string) => (!value ? 'Please select your entity' : null),
  position: (value: string) => (!value ? 'Please select your position' : null),
};

export const initialOnboardingFormValues: Omit<BasicUser, 'kinde_id' | 'kinde_email'> = {
  first_name: '',
  last_name: '',
  entity: '',
  position: '',
};
