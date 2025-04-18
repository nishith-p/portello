import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { AuthOptions, KindeUser } from '@/lib/auth/types';
import { AuthenticationError, AuthorizationError, errorResponse } from '@/lib/core/errors';

/**
 * Middleware to validate authentication and authorization for API routes
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
    return await handler(request, user as KindeUser<T>);
  } catch (error) {
    return errorResponse(error as Error);
  }
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
