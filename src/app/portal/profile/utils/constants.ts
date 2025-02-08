import { BasicUser } from '@/types/user';

export const initialBasicInfoData: Omit<BasicUser, 'kinde_id'> = {
  first_name: 'John',
  last_name: 'Doe',
  entity: 'AIESEC in Sri Lanka',
  position: 'Member Committee President',
  kinde_email: 'john.doe@aiesec.net'
};