import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { AuthenticationError, AuthorizationError, errorResponse } from '@/lib/api/errors';

// Use generics to be more compatible with Kinde's type system
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

/**
 * Middleware to validate authentication and authorization
 */
export async function withAuth<T = Record<string, unknown>>(
  request: NextRequest,
  handler: (req: NextRequest, user: KindeUser<T>) => Promise<NextResponse>,
  options: AuthOptions = {}
): Promise<NextResponse> {
  const { requireAuth = true, requireAdmin = false } = options;

  try {
    const { getUser, getPermissions } = getKindeServerSession();
    const user = await getUser();

    // Check if authentication is required
    if (requireAuth && (!user || !user.id)) {
      throw new AuthenticationError();
    }

    // Check if admin permission is required
    if (requireAdmin) {
      const permissions = await getPermissions();
      const isAdmin = permissions?.permissions?.includes('dx:admin') ?? false;

      if (!isAdmin) {
        throw new AuthorizationError('Admin access required');
      }
    }

    // Everything is valid, proceed with the request handler
    // @ts-ignore
    return await handler(request, user);
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * Check if user is authorized to access a specific user's data
 * @param targetUserId The Kinde ID of the user whose data is being accessed
 * @returns True if authorized, throws otherwise
 */
export async function isOwnUserOrAdmin(targetUserId: string): Promise<boolean> {
  const { getPermissions, getUser } = getKindeServerSession();
  const [permissions, currentUser] = await Promise.all([getPermissions(), getUser()]);

  if (!currentUser || !currentUser.id) {
    throw new AuthenticationError();
  }

  const isAdmin = permissions?.permissions?.includes('dx:admin') ?? false;
  const isOwnProfile = currentUser.id === targetUserId;

  if (!isAdmin && !isOwnProfile) {
    throw new AuthorizationError('You can only access your own data');
  }

  return true;
}

/**
 * Check if the current user has admin permissions
 * @returns True if user is an admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { getPermissions } = getKindeServerSession();
    const permissions = await getPermissions();
    return permissions?.permissions?.includes('dx:admin') ?? false;
  } catch (error) {
    return false;
  }
}

/**
 * Helper to get the current authenticated user
 * @returns The authenticated user or null if not authenticated
 */
export async function getCurrentUser<T = Record<string, unknown>>(): Promise<KindeUser<T>> {
  try {
    const { getUser } = getKindeServerSession();
    return (await getUser()) as KindeUser<T>;
  } catch (error) {
    return null;
  }
}
