'use client';

import { Container, Stack, Title } from '@mantine/core';

const AdminLandingPage = () => {
  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        <Title order={2} c="gray.8">
          Bois! 👋
        </Title>
      </Stack>
    </Container>
  );
};

export default AdminLandingPage;