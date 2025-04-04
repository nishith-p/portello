'use client';

import { Stack, Title } from '@mantine/core';

export const AdminDashboard = () => {
  return (
    <Stack gap="lg">
      <Title order={2} c="gray.8">
        Welcome, Admin! 👋
      </Title>
    </Stack>
  );
};
