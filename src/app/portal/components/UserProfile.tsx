import React from 'react';
import { IconMapPin } from '@tabler/icons-react';
import { Avatar, Container, Divider, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { User } from '@/types/users';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <Container fluid px={0} w="100%" m={0}>
      <Paper radius="md" withBorder p="xl">
        {/* Ensure Avatar + Text Stack properly on smaller screens */}
        <Group justify="space-between" wrap="wrap">
          <Group wrap="wrap" gap="md">
            <Avatar src={null} size={80} radius={80} color="blue">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </Avatar>

            <Stack gap={4} miw={150}>
              <Text fw={700} size="xl">
                {fullName}
              </Text>
              <Text c="dimmed" size="lg">
                {user.position}
              </Text>
              <Group gap={5} mt={5} wrap="wrap">
                <IconMapPin size={14} stroke={1.5} />
                <Text size="sm" c="dimmed">
                  {user.entity}
                  {user.sub_entity ? `, ${user.sub_entity}` : ''}
                  {user.region ? ` - ${user.region}` : ''}
                </Text>
              </Group>
            </Stack>
          </Group>
        </Group>

        <Divider my="lg" />

        <Title order={4} mb="md">
          Personal information
        </Title>
        <Grid gutter="md">
          {/* Ensure better spacing for small screens */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="xs">
              <Text c="dimmed" size="sm">
                First Name
              </Text>
              <Text>{user.first_name}</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="xs">
              <Text c="dimmed" size="sm">
                Last Name
              </Text>
              <Text>{user.last_name}</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12 }}>
            <Stack gap="xs">
              <Text c="dimmed" size="sm">
                AIESEC Email
              </Text>
              <Text>{user.aiesec_email}</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12 }}>
            <Stack gap="xs">
              <Text c="dimmed" size="sm">
                Personal Email
              </Text>
              <Text>{user.kinde_email}</Text>
            </Stack>
          </Grid.Col>

          {user.telegram_id && (
            <Grid.Col span={12}>
              <Stack gap="xs">
                <Text c="dimmed" size="sm">
                  Telegram ID
                </Text>
                <Text>{user.telegram_id}</Text>
              </Stack>
            </Grid.Col>
          )}

          {user.shirt_size && (
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap="xs">
                <Text c="dimmed" size="sm">
                  T-Shirt Size
                </Text>
                <Text>{user.shirt_size}</Text>
              </Stack>
            </Grid.Col>
          )}

          {user.meal_type && (
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap="xs">
                <Text c="dimmed" size="sm">
                  Meal Preference
                </Text>
                <Text>{user.meal_type}</Text>
              </Stack>
            </Grid.Col>
          )}
        </Grid>

        <Divider my="lg" />

        <Title order={4} mb="md">
          Other Details
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="xs">
              <Text c="dimmed" size="sm">
                Position
              </Text>
              <Text>{user.position}</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="xs">
              <Text c="dimmed" size="sm">
                Entity
              </Text>
              <Text>{user.entity}</Text>
            </Stack>
          </Grid.Col>

          {user.sub_entity && (
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap="xs">
                <Text c="dimmed" size="sm">
                  Sub Entity
                </Text>
                <Text>{user.sub_entity}</Text>
              </Stack>
            </Grid.Col>
          )}

          {user.region && (
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap="xs">
                <Text c="dimmed" size="sm">
                  Region
                </Text>
                <Text>{user.region}</Text>
              </Stack>
            </Grid.Col>
          )}

          {user.room_no && (
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap="xs">
                <Text c="dimmed" size="sm">
                  Room Number
                </Text>
                <Text>{user.room_no}</Text>
              </Stack>
            </Grid.Col>
          )}

          {user.tribe_no && (
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap="xs">
                <Text c="dimmed" size="sm">
                  Tribe Number
                </Text>
                <Text>{user.tribe_no}</Text>
              </Stack>
            </Grid.Col>
          )}

          {user.round !== null && (
            <Grid.Col span={12}>
              <Stack gap="xs">
                <Text c="dimmed" size="sm">
                  Registration Round
                </Text>
                <Text>{user.round}</Text>
              </Stack>
            </Grid.Col>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}
