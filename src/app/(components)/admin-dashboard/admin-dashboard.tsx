'use client';

import { Stack, Title } from '@mantine/core';
import { StatSection } from '@/app/(components)/admin-dashboard/stat-section';

export const AdminDashboard = () => {
  return (
    <Stack gap="lg">
      <Title order={2} c="gray.8">
        Dashboard
      </Title>
      <StatSection />
    </Stack>
  );
};
