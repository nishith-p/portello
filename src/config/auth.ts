export const PUBLIC_ROUTES = ['/api/auth/login', '/api/auth/register'] as const;

export const ROUTE_PERMISSIONS = {
  '/admin': ['dx:admin'],
  '/admin/store': ['dx:admin'],
  '/delegates': ['dx:admin'],
} as const;

export const PERMISSIONS = {
  ADMIN: 'dx:admin',
} as const;