import React from 'react';
import { useRouter } from 'next/navigation';
import { IconEdit, IconTarget, IconUsersGroup } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { useUserSelectionInfo } from '@/lib/users/hooks';
import { User } from '@/lib/users/types';
import { PANELS, TRACK1, TRACK2 } from './const-ysf-tracks';

interface YsfSessionsCardProps {
  user: User;
}

const THEME_COLORS: Record<string, string> = {
  Employability: 'blue',
  Leadership: 'green',
  Sustainability: 'teal',
  Diversity: 'grape',
};

export function YsfSessionsCard({ user }: YsfSessionsCardProps) {
  const router = useRouter();
  const { data: selectionInfo, isLoading } = useUserSelectionInfo();

  const getTrack1Name = (id: string | null) =>
    TRACK1.find((t) => t.id === id)?.name || 'Not Selected';

  const getTrack2Name = (id: string | null) =>
    TRACK2.find((t) => t.id === id)?.name || 'Not Selected';

  const getPanelName = (id: string | null) =>
    PANELS.find((p) => p.id === id)?.name || 'Not Selected';

  const getTrack1Color = (id: string | null) => {
    if (!id) return 'gray';
    const track = TRACK1.find((t) => t.id === id);
    return track ? THEME_COLORS[track.theme] || track.color : 'gray';
  };

  const getTrack2Color = (id: string | null) => {
    if (!id) return 'gray';
    const track = TRACK2.find((t) => t.id === id);
    return track ? THEME_COLORS[track.theme] || track.color : 'gray';
  };

  const handleEditClick = () => {
    router.push('/track');
  };

  return (
    <Container fluid px={0} w="100%" m={0} mb="xl">
      <Paper radius="md" withBorder p="md">
        <Title order={3} mb="xs">
          YSF - Session Preference Selection
        </Title>
        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          {/* Panel Discussion */}
          <Paper withBorder p="md" radius="md">
            <Stack justify="space-between">
              <ThemeIcon color="indigo" variant="light" size="lg" radius="md">
                <IconUsersGroup size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">
                  Panel Discussion
                </Text>
                <Text fw={500} size="lg">
                  {getPanelName(selectionInfo?.selections.panel)}
                </Text>
              </div>

              {selectionInfo?.selections.panel && (
                <Badge color="indigo" variant="light">
                  Selected
                </Badge>
              )}
            </Stack>
          </Paper>

          {/* Workshop 1 */}
          <Paper withBorder p="md" radius="md">
            <Stack justify="space-between">
              <ThemeIcon
                color={getTrack1Color(selectionInfo?.selections.track1)}
                variant="light"
                size="lg"
                radius="md"
              >
                <IconTarget size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">
                  Workshop 1
                </Text>
                <Text fw={500} size="lg">
                  {getTrack1Name(selectionInfo?.selections.track1)}
                </Text>
              </div>

              {selectionInfo?.selections.track1 && (
                <Badge color={getTrack1Color(selectionInfo.selections.track1)} variant="light">
                  Selected
                </Badge>
              )}
            </Stack>
          </Paper>

          {/* Workshop 2 */}
          <Paper withBorder p="md" radius="md">
            <Stack justify="space-between">
              <ThemeIcon
                color={getTrack2Color(selectionInfo?.selections.track2)}
                variant="light"
                size="lg"
                radius="md"
              >
                <IconTarget size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">
                  Workshop 2
                </Text>
                <Text fw={500} size="lg">
                  {getTrack2Name(selectionInfo?.selections.track2)}
                </Text>
              </div>

              {selectionInfo?.selections.track2 && (
                <Badge color={getTrack2Color(selectionInfo.selections.track2)} variant="light">
                  Selected
                </Badge>
              )}
            </Stack>
          </Paper>

          {/* Edit Button */}
          <Group justify="center" h="100%">
            <Tooltip label={selectionInfo?.hasSubmitted ? 'View selections' : 'Edit selections'}>
              <ActionIcon
                variant="light"
                size="xl"
                onClick={handleEditClick}
                disabled={selectionInfo?.hasSubmitted}
              >
                <IconEdit size={24} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
