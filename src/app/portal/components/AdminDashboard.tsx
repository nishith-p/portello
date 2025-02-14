'use client';

import { Container, Stack, Title } from '@mantine/core';

export const AdminDashboard = () => {
  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        <Title order={2} c="gray.8">
          Welcome, Admin! 👋
        </Title>
      </Stack>
    </Container>
  );
};
