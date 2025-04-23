'use client';

import { Button, Container, Group, Modal, Paper, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCurrentUserProfile, useRequestAccountDeletion } from '@/lib/users/hooks';

const SettingsPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: profileData, isLoading } = useCurrentUserProfile();
  const deleteRequestMutation = useRequestAccountDeletion();

  const isDeleteRequested = profileData?.user.delete_requested || false;
  const isSubmitting = deleteRequestMutation.isPending;

  const handleDeleteRequest = () => {
    deleteRequestMutation.mutate(true);
    close();
  };

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} c="gray.8" fz={{ base: 'h3', sm: 'h2' }}>
          Settings
        </Title>

        <Paper shadow="xs" p="lg">
          <Title order={4}>Data Deletion</Title>
          <Text c="dimmed" mt={15}>
            If you would like to delete your account and all associated data, you can request it
            here. Our DX will review your request and contact you within 24 hours to confirm and
            begin the process.
          </Text>
          <Button
            variant="filled"
            color="red"
            mt={15}
            onClick={open}
            disabled={isDeleteRequested || isLoading}
            loading={isSubmitting || isLoading}
          >
            {isDeleteRequested ? 'Delete Requested' : 'Request Deletion'}
          </Button>
        </Paper>
      </Stack>

      <Modal opened={opened} onClose={close} title="Confirm Account Deletion Request" centered>
        <Text size="sm">
          Are you sure you want to request deletion of your account?
        </Text>
        <Group justify="flex-end" mt="md" gap={10}>
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteRequest} loading={isSubmitting}>
            Confirm Request
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default SettingsPage;
