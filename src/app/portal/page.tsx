import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PreApprovedDashboard } from '@/app/portal/components/PreApproved';
import { PERMISSIONS } from '@/config/auth';

const PortalHomePage = async () => {
  const { getPermissions, getUser } = getKindeServerSession();
  const permissions = await getPermissions();
  const user = await getUser();

  const isAdmin = permissions?.permissions.includes(PERMISSIONS.ADMIN);
  const isApproved = permissions?.permissions.includes(PERMISSIONS.APPROVED);

  return <PreApprovedDashboard isAdmin={isAdmin} isApproved={isApproved} userId={user.id} />;
};

export default PortalHomePage;
