import React from 'react';
import { IconBowl, IconHome, IconMapPin, IconUsers } from '@tabler/icons-react';
import { Badge, Container, Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { User } from '@/types/users';

interface QuickInfoCardProps {
  user: User;
}

export function QuickInfoCard({ user }: QuickInfoCardProps) {
  return (
    <Container fluid px={0} w="100%" m={0}>
      <Paper radius="md" withBorder p="md">
        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          {/* Room Number Stat */}
          <Paper withBorder p="md" radius="md">
            <Group>
              <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                <IconHome size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">
                  Room Number
                </Text>
                <Text fw={500} size="lg">
                  {user.room_no || 'Not Assigned'}
                </Text>
              </div>
            </Group>
          </Paper>

          {/* Tribe Number Stat */}
          <Paper withBorder p="md" radius="md">
            <Group>
              <ThemeIcon color="grape" variant="light" size="lg" radius="md">
                <IconUsers size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">
                  Tribe Number
                </Text>
                <Text fw={500} size="lg">
                  {user.tribe_no || 'Not Assigned'}
                </Text>
              </div>
            </Group>
          </Paper>

          {/* Trip Confirmation Stat */}
          <Paper withBorder p="md" radius="md">
            <Group>
              <ThemeIcon
                color={user.is_trip ? 'green' : 'red'}
                variant="light"
                size="lg"
                radius="md"
              >
                <IconMapPin size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">
                  Trip Participation
                </Text>
                <Group gap={8}>
                  <Text fw={500} size="lg">
                    {user.is_trip ? 'Confirmed' : 'Not Confirmed'}
                  </Text>
                  <Badge color={user.is_trip ? 'green' : 'red'} variant="light" size="sm">
                    {user.is_trip ? 'Yes' : 'No'}
                  </Badge>
                </Group>
              </div>
            </Group>
          </Paper>

          {/* Meal Preference Stat */}
          <Paper withBorder p="md" radius="md">
            <Group>
              <ThemeIcon color="orange" variant="light" size="lg" radius="md">
                <IconBowl size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">
                  Meal Preference
                </Text>
                <Text fw={500} size="lg">
                  {user.meal_type || 'Not Specified'}
                </Text>
              </div>
            </Group>
          </Paper>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
