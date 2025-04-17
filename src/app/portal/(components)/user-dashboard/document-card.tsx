import React from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Container, Group, Paper, Text, ThemeIcon, Timeline } from '@mantine/core';
import { UserDocuments } from '@/lib/users/types';

// Interface for the component props
export interface DocumentCardProps {
  documents: UserDocuments;
}

export function DocumentStatusCard({ documents }: DocumentCardProps) {
  const documentItems = [
    {
      name: 'Indemnity Form',
      status: documents.indemnity,
      link: documents.indemnity_link,
    },
    {
      name: 'Anti-Harassment Form',
      status: documents.anti_harassment,
      link: documents.anti_harassment_link,
    },
    {
      name: 'Anti-Substance Form',
      status: documents.anti_substance,
      link: documents.anti_substance_link,
    },
    {
      name: 'Flight Details',
      status: documents.flight_ticket,
      link: documents.flight_link,
    },
    {
      name: 'Visa Details',
      status: documents.visa_confirmation,
      link: documents.visa_link,
    },
    {
      name: 'Passport',
      status: documents.passport,
      link: documents.passport_link,
    },
  ];

  const completedCount = documentItems.filter((doc) => doc.status).length;
  const totalCount = documentItems.length;

  return (
    <Container fluid px={0} w="100%" m={0}>
      <Paper radius="md" withBorder p="md">
        <Text fw={700} size="lg" mb="xs">
          Document Submission Status
        </Text>

        <Text size="sm" c="dimmed" mb="md">
          {completedCount} of {totalCount} documents submitted
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
                <Group gap="sm">
                  <Text fw={500}>{document.name}</Text>
                </Group>
              }
            >
              <Group mt={4}>
                <Text size="sm" c="dimmed">
                  {document.status
                    ? 'Document successfully submitted and verified.'
                    : 'Please submit this document as soon as possible.'}
                </Text>
              </Group>
            </Timeline.Item>
          ))}
        </Timeline>
      </Paper>
    </Container>
  );
}
