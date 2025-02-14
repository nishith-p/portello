'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LoadingOverlay } from '@mantine/core';
import { useUser } from '@/lib/hooks/useUser';
import { AdminDashboard } from './components/AdminDashboard';
import { ApprovedDashboard } from './components/ApprovedDashboard';
import { PendingDashboard } from './components/PendingDashboard';
import { RejectedDashboard } from './components/RejectedDashboard';

const PortalHomePage = () => {
  const { user, permissions, isLoading: isAuthLoading } = useKindeBrowserClient();
  const { data: userData, isLoading: isUserLoading } = useUser(user?.id);

  if (isAuthLoading || isUserLoading) {
    return <LoadingOverlay visible />;
  }

  const isAdmin = permissions?.permissions?.includes('dx:admin');

  if (isAdmin) {
    return <AdminDashboard />;
  }

  switch (userData?.status) {
    case 'approved':
      return <ApprovedDashboard />;
    case 'rejected':
      return <RejectedDashboard />;
    case 'pending':
    default:
      return <PendingDashboard />;
  }
};

export default PortalHomePage;
