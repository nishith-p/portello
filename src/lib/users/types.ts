export enum RegionType {
  APAC = 'Asia Pacific',
  MENA = 'Middle East & Africa',
  ECA = 'Europe',
  AMERICAS = 'Americas',
}

export enum MealPreferenceType {
  VEGETARIAN = 'Veg',
  NON_VEGETARIAN = 'Non Veg',
  HALAL = 'Halal',
  OTHER = 'Other',
}

export enum TShirtSizeType {
  XXS = 'XXS',
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}

export interface User {
  id: number;
  kinde_id: string;
  kinde_email: string;
  aiesec_email: string;
  first_name: string;
  last_name: string;
  entity: string;
  position: string;
  created_at: string;
  sub_entity: string | null;
  region: RegionType | null;
  room_no: string | null;
  tribe_no: string | null;
  meal_type: MealPreferenceType | null;
  shirt_size: TShirtSizeType | null;
  is_trip: boolean | null;
  telegram_id: string | null;
  delete_requested: boolean | null;
  round: number | null;
  payment: string | null;
}

export interface UserDocuments {
  user_id: string;
  passport: boolean;
  anti_harassment: boolean;
  indemnity: boolean;
  anti_substance: boolean;
  visa_confirmation: boolean;
  flight_ticket: boolean;
  passport_link: string | null;
  anti_harassment_link: string | null;
  indemnity_link: string | null;
  anti_substance_link: string | null;
  visa_link: string | null;
  flight_link: string | null;
  created_at: string;
}

export interface UserProfile {
  user: User;
  documents: UserDocuments | null;
}

export interface UserListItem {
  id: number;
  kinde_id: string;
  full_name: string;
  position: string;
  entity: string;
  sub_entity: string | null;
  aiesec_email: string;
  round: number | null;
}

export interface UserSearchParams {
  search?: string;
  entity?: string;
  position?: string;
  round?: number;
  limit?: number;
  offset?: number;
}

export interface UserListResponse {
  users: UserListItem[];
  total: number;
}

export interface UpdateDocumentParams {
  userId: string;
  document:
    | 'passport'
    | 'anti_harassment'
    | 'indemnity'
    | 'anti_substance'
    | 'visa_confirmation'
    | 'flight_ticket';
  status?: boolean;
  link?: string;
}
