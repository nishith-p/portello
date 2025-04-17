import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, withAuth } from '@/lib/auth/utils';
import { errorResponse, NotFoundError } from '@/lib/core/errors';
import { getUserProfile, searchUsers } from '@/lib/users/db';
import { UserSearchParams } from '@/lib/users/types';

/**
 * GET /api/users
 * - If admin: Get a list of all users (with search/filter/pagination)
 * - If regular user: Get their own profile
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        // Check if we have a user ID from authentication
        if (!user?.id) {
          throw new Error('User ID not found in authentication');
        }

        // Check if the user is an admin
        const userIsAdmin = await isAdmin();

        // If admin and search params are provided, return filtered user list
        if (userIsAdmin) {
          const url = new URL(req.url);

          // Check if this is a search query or a specific user lookup
          const kindeId = url.searchParams.get('kindeId');

          if (kindeId) {
            // Admin requesting specific user profile
            const userProfile = await getUserProfile(kindeId);
            if (!userProfile) {
              throw new NotFoundError('User not found');
            }
            return NextResponse.json(userProfile);
          }
          // Admin requesting list of users with search/filter
          const searchParams: UserSearchParams = {
            search: url.searchParams.get('search') || undefined,
            entity: url.searchParams.get('entity') || undefined,
            position: url.searchParams.get('position') || undefined,
            round: url.searchParams.get('round')
              ? parseInt(url.searchParams.get('round') as string, 10)
              : undefined,
            limit: url.searchParams.get('limit')
              ? parseInt(url.searchParams.get('limit') as string, 10)
              : 10,
            offset: url.searchParams.get('offset')
              ? parseInt(url.searchParams.get('offset') as string, 10)
              : 0,
          };

          const result = await searchUsers(searchParams);
          return NextResponse.json(result);
        }
        // Regular user - return their own profile only
        const userProfile = await getUserProfile(user.id);
        if (!userProfile) {
          throw new NotFoundError('User profile not found');
        }
        return NextResponse.json(userProfile);
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true }
  );
}
