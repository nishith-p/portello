import { ROUTE_PERMISSIONS, PERMISSIONS } from '@/config/auth';

export type RoutePermissions = typeof ROUTE_PERMISSIONS;
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface AuthRedirectOptions {
  returnTo?: string;
  message?: string;
}