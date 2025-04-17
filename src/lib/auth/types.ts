import { PERMISSIONS, ROUTE_PERMISSIONS } from '@/config/auth';

export type RoutePermissions = typeof ROUTE_PERMISSIONS;
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface AuthRedirectOptions {
  returnTo?: string;
  message?: string;
}

export type KindeUser<T = Record<string, unknown>> =
  | ({
      id: string;
      given_name: string | null;
      family_name: string | null;
      email: string | null;
      picture: string | null;
    } & T)
  | null;

export type AuthOptions = {
  requireAuth?: boolean;
  requireAdmin?: boolean;
};
