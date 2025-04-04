import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PUBLIC_ROUTES, ROUTE_PERMISSIONS } from '@/config/auth';

export default withAuth(
  async (req: NextRequest) => {
    const { pathname } = req.nextUrl;

    // Skip all checks for public routes
    if (PUBLIC_ROUTES.includes(pathname as any)) {
      return NextResponse.next();
    }

    // Get user info, and permission info from Kinde servers
    const { getUser, getPermissions } = getKindeServerSession();
    const [user, permissions] = await Promise.all([getUser(), getPermissions()]);

    // Check if user exists in Kinde, if not, redirect to login page
    if (!user) {
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    // Set permissions to userPermission for ease
    const userPermissions = permissions?.permissions || [];

    // Check route-specific permissions, and if no permission, redirect to home page
    const requiredPermissions = ROUTE_PERMISSIONS[pathname as keyof typeof ROUTE_PERMISSIONS];

    if (
      requiredPermissions?.length &&
      !requiredPermissions.some((p) => userPermissions.includes(p))
    ) {
      return NextResponse.redirect(new URL('/portal', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|$).*)'],
};
