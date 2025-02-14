'use client';

import { Container, Stack, Text, Title } from '@mantine/core';

export const ApprovedDashboard = () => {
  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        <Title order={2} c="gray.8">
          Welcome back! 👋
        </Title>
        <Text c="dimmed">
          Your account is fully approved. You have access to all delegate features.
        </Text>
        {/* Add approved user specific content here */}
      </Stack>
    </Container>
  );
};
