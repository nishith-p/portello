'use client';

import {
  IconBowl,
  IconBuildingCommunity,
  IconBuildingSkyscraper,
  IconChartBar,
  IconMapPin,
  IconUserPlus,
  IconUsers,
  IconWorld,
} from '@tabler/icons-react';
import {
  Badge,
  Container,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useUserHooks } from '@/lib/users/hooks';

type PositionKey = 'MCP' | 'MCVP' | 'LCP' | 'Other';

export const StatSection = () => {
  const { useUserStats } = useUserHooks();
  const { data: stats, isLoading, error } = useUserStats();

  if (isLoading) {
    return (
      <Container fluid py="xl">
        <Group justify="center" py="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid py="xl">
        <Paper withBorder p="md" radius="md">
          <Text c="red" ta="center">
            Error loading user statistics.
          </Text>
        </Paper>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container fluid py="xl">
        <Paper withBorder p="md" radius="md">
          <Text ta="center">No data available.</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container fluid px={0} w="100%">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        {/* Total Users */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconUsers size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">
                Total Delegates
              </Text>
              <Text fw={500} size="lg">
                {stats.totalUsers}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Trip Participants */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <ThemeIcon color="green" variant="light" size="lg">
              <IconMapPin size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">
                Trip Participants
              </Text>
              <Text fw={500} size="lg">
                {stats.tripCount}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Total Entities (based on top entities list size) */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <ThemeIcon color="grape" variant="light" size="lg">
              <IconBuildingSkyscraper size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">
                Total Entities
              </Text>
              <Text fw={500} size="lg">
                {stats.topEntities?.length ?? 0}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Total Sub-Entities (based on top sub-entities list size) */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <ThemeIcon color="orange" variant="light" size="lg">
              <IconBuildingCommunity size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">
                Total Sub-Entities
              </Text>
              <Text fw={500} size="lg">
                {stats.topSubEntities?.length ?? 0}
              </Text>
            </div>
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Position Distribution */}
      <Title order={4} mb="sm" c="gray">
        Position Distribution
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        {[
          { key: 'MCP' as PositionKey, color: 'indigo' },
          { key: 'MCVP' as PositionKey, color: 'violet' },
          { key: 'LCP' as PositionKey, color: 'pink' },
          { key: 'Other' as PositionKey, color: 'gray' },
        ].map((position) => (
          <Paper withBorder p="md" radius="md" key={position.key}>
            <Group>
              <ThemeIcon color={position.color} variant="light" size="lg">
                <IconUserPlus size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">
                  {position.key}
                </Text>
                <Text fw={500} size="lg">
                  {stats.positionCounts[position.key]}
                </Text>
              </div>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Region and Meal Preferences */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" mb="xl">
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={4}>
              <Group gap={8}>
                <ThemeIcon color="cyan" variant="light" size="sm">
                  <IconWorld size={16} />
                </ThemeIcon>
                <Text fw={700}>Region Distribution</Text>
              </Group>
            </Title>
          </Group>
          <Stack gap="sm">
            {Object.entries(stats.regionCounts ?? {}).map(([region, count]) => (
              <Paper key={region} withBorder p="sm" radius="md">
                <Group justify="space-between">
                  <Text>{region}</Text>
                  <Badge
                    size="lg"
                    radius="sm"
                    variant="light"
                    color="blue"
                    style={{ width: '60px' }}
                  >
                    {count}
                  </Badge>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Paper>

        {/* Meal Preferences */}
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={4}>
              <Group gap={8}>
                <ThemeIcon color="orange" variant="light" size="sm">
                  <IconBowl size={16} />
                </ThemeIcon>
                <Text fw={700}>Meal Preferences</Text>
              </Group>
            </Title>
          </Group>
          <Stack gap="sm">
            {Object.entries(stats.mealTypeCounts ?? {}).map(([mealType, count]) => (
              <Paper key={mealType} withBorder p="sm" radius="md">
                <Group justify="space-between">
                  <Text>{mealType}</Text>
                  <Badge
                    size="lg"
                    radius="sm"
                    variant="light"
                    color="blue"
                    style={{ width: '60px' }}
                  >
                    {count}
                  </Badge>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </SimpleGrid>

      {/* Top Entities and Sub-Entities */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" mb="xl">
        {/* Top Entities */}
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={4}>
              <Group gap={8}>
                <ThemeIcon color="grape" variant="light" size="sm">
                  <IconBuildingSkyscraper size={16} />
                </ThemeIcon>
                <Text fw={700}>Top 10 Entities</Text>
              </Group>
            </Title>
          </Group>
          <Stack gap="sm">
            {(stats.topEntities ?? []).map((item, index) => (
              <Paper key={item.entity || index} withBorder p="sm" radius="md">
                <Group justify="space-between">
                  <Group>
                    <Badge size="sm" variant="filled" circle>
                      {index + 1}
                    </Badge>
                    <Text>{item.entity}</Text>
                  </Group>
                  <Badge
                    size="lg"
                    radius="sm"
                    variant="light"
                    color="blue"
                    style={{ width: '60px' }}
                  >
                    {item.count}
                  </Badge>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Paper>

        {/* Top Sub-Entities */}
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={4}>
              <Group gap={8}>
                <ThemeIcon color="teal" variant="light" size="sm">
                  <IconBuildingCommunity size={16} />
                </ThemeIcon>
                <Text fw={700}>Top 10 Sub-Entities</Text>
              </Group>
            </Title>
          </Group>
          <Stack gap="sm">
            {(stats.topSubEntities ?? []).map((item, index) => (
              <Paper key={item.sub_entity || index} withBorder p="sm" radius="md">
                <Group justify="space-between">
                  <Group>
                    <Badge size="sm" variant="filled" circle>
                      {index + 1}
                    </Badge>
                    <Text>{item.sub_entity}</Text>
                  </Group>
                  <Badge
                    size="lg"
                    radius="sm"
                    variant="light"
                    color="blue"
                    style={{ width: '60px' }}
                  >
                    {item.count}
                  </Badge>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </SimpleGrid>

      {/* Registration Rounds */}
      <Paper withBorder p="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>
            <Group gap={8}>
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconChartBar size={16} />
              </ThemeIcon>
              <Text fw={700}>Registration Rounds</Text>
            </Group>
          </Title>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {Object.entries(stats.roundCounts ?? {}).map(([round, count]) => (
            <Paper key={round} withBorder p="md" radius="md">
              <Group>
                <ThemeIcon
                  color="blue"
                  variant="light"
                  size="lg"
                  style={{
                    backgroundColor: `rgba(25, 113, 194, ${Math.min(
                      0.2 + (Number(count) / (stats.totalUsers || 1)) * 0.8,
                      0.9
                    )})`,
                  }}
                >
                  <Text fw={700} style={{ color: 'white' }}>
                    {round}
                  </Text>
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Round {round}
                  </Text>
                  <Group gap={8}>
                    <Text fw={500} size="lg">
                      {count}
                    </Text>
                    <Badge size="sm" variant="filled" color="blue">
                      {((Number(count) / (stats.totalUsers || 1)) * 100).toFixed(1)}%{' '}
                    </Badge>
                  </Group>
                </div>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      </Paper>
    </Container>
  );
};
