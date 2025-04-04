import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const isOwnUserOrAdmin = async (targetUserId: string) => {
  const { getPermissions, getUser } = getKindeServerSession();
  const [permissions, currentUser] = await Promise.all([getPermissions(), getUser()]);

  const isAdmin = permissions?.permissions?.includes('dx:admin') ?? false;
  const isOwnProfile = currentUser?.id === targetUserId;

  if (!isAdmin && !isOwnProfile) {
    throw new Error('Unauthorized');
  }
}

