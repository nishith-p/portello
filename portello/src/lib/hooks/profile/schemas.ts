/**
 * Validation schema for basic user information form
 */
export const basicInfoValidation = {
  kinde_email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
  first_name: (value: string) => (value.length < 2 ? 'First name is too short' : null),
  last_name: (value: string) => (value.length < 2 ? 'Last name is too short' : null),
  entity: (value: string) => (!value ? 'Entity is required' : null),
  position: (value: string) => (!value ? 'Position is required' : null),
};