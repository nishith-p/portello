import React from 'react';
import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';

interface DocumentLinkModalProps {
  opened: boolean;
  onClose: () => void;
  documentLink: string;
  setDocumentLink: (link: string) => void;
  onSave: () => void;
  isLoading: boolean;
}

export function DocumentLinkModal({
  opened,
  onClose,
  documentLink,
  setDocumentLink,
  onSave,
  isLoading,
}: DocumentLinkModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
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

        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} loading={isLoading}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
