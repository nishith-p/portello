// contact/page.tsx
'use client';

import { Container, Stack } from '@mantine/core';
import { ContactHeader } from './components/ContactHeader';
import { ContactTable } from './components/ContactTable';

const dxTeam = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'DX Team Lead',
    email: 'sarah.johnson@aiesec.net',
    phone: '+94 71 234 5678',
  },
  {
    id: '2',
    name: 'David Lee',
    position: 'DX Team Member',
    email: 'david.lee@aiesec.net',
    phone: '+94 71 234 5679',
  },
];

const coreTeam = [
  {
    id: '1',
    name: 'Michael Chen',
    position: 'Core Committee Lead',
    email: 'michael.chen@aiesec.net',
    phone: '+94 71 876 5432',
  },
  {
    id: '2',
    name: 'Emma Wilson',
    position: 'Core Committee Member',
    email: 'emma.wilson@aiesec.net',
    phone: '+94 71 876 5433',
  },
];

const ContactPage = () => {
  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="xl">
        <ContactHeader />

        <ContactTable title="DX Team" members={dxTeam} />

        <ContactTable title="Core Committee Team" members={coreTeam} />
      </Stack>
    </Container>
  );
};

export default ContactPage;
