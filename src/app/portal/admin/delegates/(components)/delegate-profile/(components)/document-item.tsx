import React from 'react';
import { IconCheck, IconEdit, IconFile, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { ActionIcon, Button, Group, Switch, Text, ThemeIcon } from '@mantine/core';
import { DocumentKey } from '../index';

interface DocumentItemProps {
  name: string;
  type: DocumentKey;
  status: boolean;
  link: string | null;
  isLoading: boolean;
  onStatusToggle: (docType: DocumentKey, currentStatus: boolean) => void;
  onLinkEdit: (docType: DocumentKey, currentLink: string | null) => void;
  onLinkDelete: (docType: DocumentKey) => void;
}

export function DocumentItem({
  name,
  type,
  status,
  link,
  isLoading,
  onStatusToggle,
  onLinkEdit,
  onLinkDelete,
}: DocumentItemProps) {
  return (
    <>
      <Group>
        <Text fw={500}>{name}</Text>
        <Switch
          checked={status}
          onChange={() => onStatusToggle(type, status)}
          size="sm"
          disabled={isLoading}
        />
      </Group>

      <Group mt={4}>
        <Text size="sm" c="dimmed">
          {status ? 'Document submitted and verified.' : 'Document not submitted.'}
        </Text>
        <Group>
          {link ? (
            <>
              <ActionIcon
                component="a"
                href={link}
                target="_blank"
                variant="subtle"
                color="blue"
                disabled={isLoading}
              >
                <IconFile size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => onLinkEdit(type, link)}
                disabled={isLoading}
              >
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => onLinkDelete(type)}
                disabled={isLoading}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </>
          ) : (
            <Button
              leftSection={<IconUpload size={14} />}
              variant="light"
              size="xs"
              onClick={() => onLinkEdit(type, null)}
              disabled={isLoading}
            >
              Add Link
            </Button>
          )}
        </Group>
      </Group>
    </>
  );
}

export function DocumentItemBullet({ status }: { status: boolean }) {
  return (
    <ThemeIcon color={status ? 'lime' : 'gray'} radius="xl" size={24}>
      {status ? <IconCheck size={16} /> : <IconX size={16} />}
    </ThemeIcon>
  );
}
