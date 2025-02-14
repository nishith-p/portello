'use client';

import { Container, Stack, Title, Alert } from '@mantine/core';

export const RejectedDashboard = () => {
  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        <Title order={2} c="gray.8">
          Application Status
        </Title>
        <Alert color="red" title="Application Rejected">
          Unfortunately, your delegate application has been rejected. Please contact the Delegates
          Experience Team for more information.
        </Alert>
      </Stack>
    </Container>
  );
};
