'use client';

import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, Center, Loader, Modal, Text } from '@mantine/core';
import { useUserProfile } from '@/lib/users/hooks';
import { DelegateProfile } from './delegate-profile';

interface DelegateProfileModalProps {
  opened: boolean;
  onCloseAction: () => void;
  userId: string | null;
}

export function DelegateProfileModal({ opened, onCloseAction, userId }: DelegateProfileModalProps) {
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(userId);

  return (
    <Modal
      opened={opened}
      onClose={onCloseAction}
      title={
        <Text fw={700} size="lg">
          Delegate Profile
        </Text>
      }
      size="xl"
      centered
    >
      {isProfileLoading ? (
        <Center p="xl">
          <Loader />
        </Center>
      ) : userProfile?.user ? (
        <DelegateProfile user={userProfile.user} documents={userProfile.documents} />
      ) : (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Failed to load delegate profile
        </Alert>
      )}
    </Modal>
  );
}
