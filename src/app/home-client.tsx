'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Container, LoadingOverlay } from '@mantine/core';
import { AdminDashboard, UserDashboard } from './(portal)/(components)';

export default function ClientHomePage() {
  const { permissions, isLoading: isAuthLoading } = useKindeBrowserClient();

  const isAdmin = permissions?.permissions?.includes('dx:admin');

  return (
    <Container fluid p="md">
      {isAuthLoading ? <LoadingOverlay /> : isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </Container>
  );
}
