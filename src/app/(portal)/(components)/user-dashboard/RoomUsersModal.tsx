import React from 'react';
import { IconAlertCircle, IconUser } from '@tabler/icons-react';
import {
  Alert,
  Avatar,
  Badge,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useRoomUsers } from '@/lib/users/hooks';

interface RoomUsersModalProps {
  opened: boolean;
  onClose: () => void;
  roomNo: string | null;
}

export function RoomUsersModal({ opened, onClose, roomNo }: RoomUsersModalProps) {
  const { data, isLoading, error } = useRoomUsers(roomNo);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="md"
      padding="lg"
    >
      <div style={{ position: 'relative', minHeight: 200 }}>
        <LoadingOverlay visible={isLoading} />

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
            {error.message}
          </Alert>
        )}

        {data && (
          <Stack gap="sm">
            {data.users.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No users found in this room
              </Text>
            ) : (
              <>
                <Text size="xl" fw={700} mb="sm">
                  Delegates in Room {roomNo}
                </Text>

                {data.users.map((user) => (
                  <Paper key={user.id} p="md" withBorder radius="md">
                    <Group justify="space-between">
                      <Group>
                        <div>
                          <Text fw={500} size="sm">
                            {user.full_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {user.aiesec_email}
                          </Text>
                          {/* {user.telegram_id && (
                            <Text size="xs" c="dimmed">
                              {user.telegram_id}
                            </Text>
                          )} */}
                        </div>
                      </Group>

                      <Stack gap={4} align="flex-end">
                        <Badge variant="light" size="sm">
                          {user.position}
                        </Badge>
                        {user.entity && (
                          <Text size="xs" c="dimmed">
                            {user.entity}
                            {user.sub_entity && ` - ${user.sub_entity}`}
                          </Text>
                        )}
                      </Stack>
                    </Group>
                  </Paper>
                ))}
              </>
            )}
          </Stack>
        )}
      </div>
    </Modal>
  );
}
