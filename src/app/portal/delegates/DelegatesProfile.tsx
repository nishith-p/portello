import React, { useState } from 'react';
import {
  IconCheck,
  IconEdit,
  IconFile,
  IconMapPin,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Timeline,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUpdateDocument } from '@/lib/api/hooks/useDocuments';
import { User, UserDocuments } from '@/types/users';

// Type for document keys
type DocumentKey =
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

  const documentItems = documents
    ? [
        {
          type: 'indemnity' as DocumentKey,
          name: 'Indemnity Form',
          status: documents.indemnity,
          link: documents.indemnity_link,
        },
        {
          type: 'anti_harassment' as DocumentKey,
          name: 'Anti-Harassment Form',
          status: documents.anti_harassment,
          link: documents.anti_harassment_link,
        },
        {
          type: 'anti_substance' as DocumentKey,
          name: 'Anti-Substance Form',
          status: documents.anti_substance,
          link: documents.anti_substance_link,
        },
        {
          type: 'flight_ticket' as DocumentKey,
          name: 'Flight Details',
          status: documents.flight_ticket,
          link: documents.flight_link,
        },
        {
          type: 'visa_confirmation' as DocumentKey,
          name: 'Visa Details',
          status: documents.visa_confirmation,
          link: documents.visa_link,
        },
        {
          type: 'passport' as DocumentKey,
          name: 'Passport',
          status: documents.passport,
          link: documents.passport_link,
        },
      ]
    : [];

  const completedCount = documents ? documentItems.filter((doc) => doc.status).length : 0;

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
            <div>
              <Text fw={700} size="lg" mb={8}>
                Personal Information
              </Text>

              <Paper p="md" withBorder radius="md">
                <Stack gap="xs">
                  <Grid>
                    <Grid.Col span={6}>
                      <Text c="dimmed" size="sm">
                        First Name
                      </Text>
                      <Text>{user.first_name}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text c="dimmed" size="sm">
                        Last Name
                      </Text>
                      <Text>{user.last_name}</Text>
                    </Grid.Col>
                  </Grid>

                  <Divider my="xs" />

                  <Text c="dimmed" size="sm">
                    AIESEC Email
                  </Text>
                  <Text>{user.aiesec_email}</Text>

                  <Divider my="xs" />

                  <Text c="dimmed" size="sm">
                    Personal Email
                  </Text>
                  <Text>{user.kinde_email}</Text>

                  {user.telegram_id && (
                    <>
                      <Divider my="xs" />
                      <Text c="dimmed" size="sm">
                        Telegram ID
                      </Text>
                      <Text>{user.telegram_id}</Text>
                    </>
                  )}
                </Stack>
              </Paper>
            </div>

            <div>
              <Text fw={700} size="lg" mb={8}>
                Other Details
              </Text>

              <Paper p="md" withBorder radius="md">
                <Grid gutter="md">
                  <Grid.Col span={6}>
                    <Text c="dimmed" size="sm">
                      Registration Round
                    </Text>
                    <Text>{user.round || 'Not specified'}</Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text c="dimmed" size="sm">
                      Room Number
                    </Text>
                    <Text>{user.room_no || 'Not assigned'}</Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text c="dimmed" size="sm">
                      Tribe Number
                    </Text>
                    <Text>{user.tribe_no || 'Not assigned'}</Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text c="dimmed" size="sm">
                      Meal Preference
                    </Text>
                    <Text>{user.meal_type || 'Not specified'}</Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text c="dimmed" size="sm">
                      T-Shirt Size
                    </Text>
                    <Text>{user.shirt_size || 'Not specified'}</Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text c="dimmed" size="sm">
                      Trip Participation
                    </Text>
                    <Group gap={8} mt={4}>
                      <Text>{user.is_trip ? 'Confirmed' : 'Not Confirmed'}</Text>
                      <Badge color={user.is_trip ? 'green' : 'red'} variant="light" size="sm">
                        {user.is_trip ? 'Yes' : 'No'}
                      </Badge>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Paper>
            </div>
          </Stack>
        </Grid.Col>

        {/* Right column - Documents */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Group mb={8}>
            <Text fw={700} size="lg">
              Document Status
            </Text>
            {updateDocument.isPending && <Badge color="blue">Updating...</Badge>}
          </Group>

          <Paper p="md" withBorder radius="md">
            {documents ? (
              <>
                <Text c="dimmed" size="sm" mb="md">
                  {completedCount} of {documentItems.length} documents submitted
                </Text>

                <Timeline active={completedCount} bulletSize={24} lineWidth={1} color="gray">
                  {documentItems.map((document, index) => (
                    <Timeline.Item
                      key={index}
                      bullet={
                        <ThemeIcon color={document.status ? 'lime' : 'gray'} radius="xl" size={24}>
                          {document.status ? <IconCheck size={16} /> : <IconX size={16} />}
                        </ThemeIcon>
                      }
                      title={
                        <Group>
                          <Text fw={500}>{document.name}</Text>
                          <Switch
                            checked={document.status}
                            onChange={() => handleStatusToggle(document.type, document.status)}
                            size="sm"
                            disabled={updateDocument.isPending}
                          />
                        </Group>
                      }
                    >
                      <Group mt={4}>
                        <Text size="sm" c="dimmed">
                          {document.status
                            ? 'Document submitted and verified.'
                            : 'Document not submitted.'}
                        </Text>
                        <Group>
                          {document.link ? (
                            <>
                              <ActionIcon
                                component="a"
                                href={document.link}
                                target="_blank"
                                variant="subtle"
                                color="blue"
                                disabled={updateDocument.isPending}
                              >
                                <IconFile size={16} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => handleLinkEdit(document.type, document.link)}
                                disabled={updateDocument.isPending}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() => {
                                  updateDocument.mutate({
                                    userId: user.kinde_id,
                                    document: document.type,
                                    link: '',
                                  });
                                }}
                                disabled={updateDocument.isPending}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </>
                          ) : (
                            <Button
                              leftSection={<IconUpload size={14} />}
                              variant="light"
                              size="xs"
                              onClick={() => handleLinkEdit(document.type, null)}
                              disabled={updateDocument.isPending}
                            >
                              Add Link
                            </Button>
                          )}
                        </Group>
                      </Group>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No document information available
              </Text>
            )}
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Document Link Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={600}>Edit Document Link</Text>}
        centered
      >
        <Stack>
          <TextInput
            label="Document URL"
            placeholder="https://example.com/document.pdf"
            value={documentLink}
            onChange={(e) => setDocumentLink(e.currentTarget.value)}
            required
          />

          <Group>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleLinkSave} loading={updateDocument.isPending}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
