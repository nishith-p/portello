export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface BasicUser {
  kinde_id: string;
  kinde_email: string;
  first_name: string;
  last_name: string;
  entity: string;
  position: string;
  status?: UserStatus;
}

export interface User extends BasicUser {
  id: number;
  created_at: string;
}
