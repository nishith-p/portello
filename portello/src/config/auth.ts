export const PUBLIC_ROUTES = ['/', '/api/auth/login', '/api/auth/register'] as const;

export const ROUTE_PERMISSIONS = {
  '/portal/admin': ['dx:admin'],
  '/portal/delegates': ['dx:admin'],
} as const;

export const PERMISSIONS = {
  ADMIN: 'dx:admin',
} as const;
