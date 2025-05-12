import React from 'react';
import { Badge, Grid, Group, Paper, Text } from '@mantine/core';
import { User } from '@/lib/users/types';

interface OtherDetailsSectionProps {
  user: User;
}

export function OtherDetailsSection({ user }: OtherDetailsSectionProps) {
  return (
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
  );
}
