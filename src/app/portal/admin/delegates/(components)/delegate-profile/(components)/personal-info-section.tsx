import React from 'react';
import { Divider, Grid, Paper, Stack, Text } from '@mantine/core';
import { User } from '@/lib/users/types';

interface PersonalInfoSectionProps {
  user: User;
}

export function PersonalInfoSection({ user }: PersonalInfoSectionProps) {
  return (
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
  );
}
