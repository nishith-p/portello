import React, { useState } from 'react';
import { IconMapPin } from '@tabler/icons-react';
import { Avatar, Divider, Grid, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUpdateDocument } from '@/lib/users/hooks';
import { User, UserDocuments } from '@/lib/users/types';
import {
  DocumentLinkModal,
  DocumentsSection,
  OtherDetailsSection,
  PersonalInfoSection,
} from './(components)';

export type DocumentKey =
  | 'passport'
  | 'anti_harassment'
  | 'indemnity'
  | 'anti_substance'
  | 'visa_confirmation'
  | 'flight_ticket';

interface DelegateProfileProps {
  user: User;
  documents: UserDocuments | null;
}

export function DelegateProfile({ user, documents }: DelegateProfileProps) {
  const fullName = `${user.first_name} ${user.last_name}`;

  // Set up document update mutation
  const updateDocument = useUpdateDocument();

  // State for link edit modal
  const [opened, { open, close }] = useDisclosure(false);
  const [activeDocumentType, setActiveDocumentType] = useState<DocumentKey>('passport');
  const [documentLink, setDocumentLink] = useState('');

  // Handle document status toggle
  const handleStatusToggle = (docType: DocumentKey, currentStatus: boolean) => {
    updateDocument.mutate({
      userId: user.kinde_id,
      document: docType,
      status: !currentStatus,
    });
  };

  // Handle document link edit
  const handleLinkEdit = (docType: DocumentKey, currentLink: string | null) => {
    setActiveDocumentType(docType);
    setDocumentLink(currentLink || '');
    open();
  };

  // Handle document link save
  const handleLinkSave = () => {
    updateDocument.mutate(
      {
        userId: user.kinde_id,
        document: activeDocumentType,
        link: documentLink,
      },
      {
        onSuccess: () => {
          close();
        },
      }
    );
  };

  // Handle document link delete
  const handleLinkDelete = (docType: DocumentKey) => {
    updateDocument.mutate({
      userId: user.kinde_id,
      document: docType,
      link: '',
    });
  };

  return (
    <Stack gap="lg" p="md">
      {/* Header with avatar and basic info */}
      <Group wrap="nowrap" align="flex-start" mb="sm">
        <Avatar src={null} size={80} radius={80} color="blue">
          {user.first_name.charAt(0)}
          {user.last_name.charAt(0)}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text fw={700} size="xl">
            {fullName}
          </Text>
          <Text c="dimmed" size="lg">
            {user.position}
          </Text>
          <Group gap={5} mt={4}>
            <IconMapPin size={14} stroke={1.5} />
            <Text size="sm" c="dimmed">
              {user.entity}
              {user.sub_entity ? `, ${user.sub_entity}` : ''}
              {user.region ? ` - ${user.region}` : ''}
            </Text>
          </Group>
        </div>
      </Group>

      <Divider />

      {/* Main content */}
      <Grid gutter="xl">
        {/* Left column - Personal Information */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            <PersonalInfoSection user={user} />
            <OtherDetailsSection user={user} />
          </Stack>
        </Grid.Col>

        {/* Right column - Documents */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DocumentsSection
            user={user}
            documents={documents}
            updateDocument={updateDocument}
            onStatusToggle={handleStatusToggle}
            onLinkEdit={handleLinkEdit}
            onLinkDelete={handleLinkDelete}
          />
        </Grid.Col>
      </Grid>

      {/* Document Link Edit Modal */}
      <DocumentLinkModal
        opened={opened}
        onClose={close}
        documentLink={documentLink}
        setDocumentLink={setDocumentLink}
        onSave={handleLinkSave}
        isLoading={updateDocument.isPending}
      />
    </Stack>
  );
}
