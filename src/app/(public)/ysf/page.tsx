'use client';

import { Container, Stack, Text, Title } from '@mantine/core';

const YSFPage = () => {
  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} c="gray.8" fz={{ base: 'h3', sm: 'h2' }}>
          YouthSpeak Forum
        </Title>

        <Text c="dimmed" fz={{ base: 'sm', sm: 'md' }}>
          Bla bla bla
        </Text>

        <div>You are not supposed to find this yet!</div>
      </Stack>
    </Container>
  );
};

export default YSFPage;
