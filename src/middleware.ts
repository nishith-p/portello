import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PUBLIC_ROUTES, ROUTE_PERMISSIONS } from '@/config/auth';

export default withAuth(
  async (req: NextRequest) => {
    const { pathname } = req.nextUrl;

    // Allow public routes
    if (PUBLIC_ROUTES.includes(pathname as any)) {
      return NextResponse.next();
    }

    const { getUser, getPermissions } = getKindeServerSession();
    const [user, permissions] = await Promise.all([getUser(), getPermissions()]);

    if (!user) {
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    // Check route permissions
    const requiredPermissions = ROUTE_PERMISSIONS[pathname as keyof typeof ROUTE_PERMISSIONS];
    if (requiredPermissions) {
      const hasPermission = requiredPermissions.some((permission) =>
        permissions?.permissions.includes(permission)
      );

      if (!hasPermission) {
        return NextResponse.redirect(new URL('/', req.url));
      }
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
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|$).*)'],
};
