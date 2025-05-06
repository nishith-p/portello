import React from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Badge, Group, Paper, Text, Timeline } from '@mantine/core';
import { User, UserDocuments } from '@/lib/users/types';
import { DocumentKey } from '../index';
import { DocumentItem, DocumentItemBullet } from './document-item';

interface DocumentsSectionProps {
  user: User;
  documents: UserDocuments | null;
  updateDocument: UseMutationResult<any, Error, any, unknown>;
  onStatusToggle: (docType: DocumentKey, currentStatus: boolean) => void;
  onLinkEdit: (docType: DocumentKey, currentLink: string | null) => void;
  onLinkDelete: (docType: DocumentKey) => void;
}

export function DocumentsSection({
  documents,
  updateDocument,
  onStatusToggle,
  onLinkEdit,
  onLinkDelete,
}: DocumentsSectionProps) {
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
    <>
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
                  bullet={<DocumentItemBullet status={document.status} />}
                  title={
                    <DocumentItem
                      name={document.name}
                      type={document.type}
                      status={document.status}
                      link={document.link}
                      isLoading={updateDocument.isPending}
                      onStatusToggle={onStatusToggle}
                      onLinkEdit={onLinkEdit}
                      onLinkDelete={onLinkDelete}
                    />
                  }
                />
              ))}
            </Timeline>
          </>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            No document information available
          </Text>
        )}
      </Paper>
    </>
  );
}
