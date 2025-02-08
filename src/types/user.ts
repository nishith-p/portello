export type BasicUser = {
  kinde_id: string;
  kinde_email: string
  first_name: string;
  last_name: string;
  entity: string;
  position: string;
  status?: 'pending' | 'active' | 'suspended';
}

