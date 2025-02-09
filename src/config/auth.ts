export const PUBLIC_ROUTES = ['/', '/api/auth/login', '/api/auth/register'] as const;

export const ROUTE_PERMISSIONS = {
  '/portal/admin': ['dx_team:admin'],
} as const;

export const PERMISSIONS = {
  PENDING: 'delegate:pending',
  APPROVED: 'delegate:approved',
  ADMIN: 'dx:admin',
} as const;
