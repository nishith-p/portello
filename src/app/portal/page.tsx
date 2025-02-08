import { PreApprovedDashboard } from '@/app/portal/components/PreApproved';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PERMISSIONS } from '@/config/auth';

const PortalHomePage = async () => {
  const { getPermissions } = getKindeServerSession();
  const permissions = await getPermissions();

  const isAdmin = permissions?.permissions.includes(PERMISSIONS.ADMIN);
  const isApproved = permissions?.permissions.includes(PERMISSIONS.APPROVED)

  return <PreApprovedDashboard isAdmin={isAdmin} isApproved={isApproved}  />;
};

export default PortalHomePage;
