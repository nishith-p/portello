export interface UserProfile {
  kinde_id: string;
  first_name: string;
  last_name: string;
  status: 'pending' | 'active' | 'suspended';
}