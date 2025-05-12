'use client';

import { Container, Stack, Text, Title } from '@mantine/core';
import { ContactTable } from '@/app/(portal)/contact/(components)';
import { coreTeam, dxTeam } from '@/app/(portal)/contact/constants';

const ContactPage = () => {
  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} c="gray.8" fz={{ base: 'h3', sm: 'h2' }}>
          Contact Information
        </Title>

        <Text c="dimmed" fz={{ base: 'sm', sm: 'md' }}>
          Contact our team members for any questions or assistance during the event.
        </Text>

        <ContactTable title="Delegates Experience Team" members={dxTeam} />

        <ContactTable title="Congress Committee Core Team" members={coreTeam} />
      </Stack>
    </Container>
  );
};

export default ContactPage;
