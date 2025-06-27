import React, { useState } from 'react';
import { IconEdit, IconTarget, IconUsersGroup } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { useUserSelectionInfo } from '@/lib/users/hooks';
import { User } from '@/lib/users/types';
import { PANELS, TRACKS } from './const-ysf-tracks';
import { TrackSelectionModal } from './track-selection-modal';

interface YsfSessionsCardProps {
  user: User;
}

const TRACK_COLORS: Record<string, string> = {
  employability: 'blue',
  leadership: 'green',
  sustainability: 'teal',
  diversity: 'grape',
};

export function YsfSessionsCard({ user }: YsfSessionsCardProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const { data: selectionInfo, isLoading } = useUserSelectionInfo();

  const getTrackName = (id: string | null) =>
    TRACKS.find((t) => t.id === id)?.name || 'Not Selected';

  const getPanelName = (id: string | null) =>
    PANELS.find((p) => p.id === id)?.name || 'Not Selected';

  const getTrackColor = (id: string | null) => (id ? TRACK_COLORS[id] : 'gray');

  return (
    <>
      <Container fluid px={0} w="100%" m={0}>
        <Paper radius="md" withBorder p="md">
          <SimpleGrid cols={{ base: 1, lg: 2 }}>
            {/* Panel Discussion */}
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between">
                <Group>
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
                </Group>
                {selectionInfo?.selections.panel && (
                  <Badge color="indigo" variant="light">
                    Selected
                  </Badge>
                )}
              </Group>
            </Paper>

            {/* Track Session 1 */}
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between">
                <Group>
                  <ThemeIcon
                    color={getTrackColor(selectionInfo?.selections.track1)}
                    variant="light"
                    size="lg"
                    radius="md"
                  >
                    <IconTarget size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed">
                      Track Session 1
                    </Text>
                    <Text fw={500} size="lg">
                      {getTrackName(selectionInfo?.selections.track1)}
                    </Text>
                  </div>
                </Group>
                {selectionInfo?.selections.track1 && (
                  <Badge color={getTrackColor(selectionInfo.selections.track1)} variant="light">
                    Selected
                  </Badge>
                )}
              </Group>
            </Paper>

            {/* Track Session 2 */}
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between">
                <Group>
                  <ThemeIcon
                    color={getTrackColor(selectionInfo?.selections.track2)}
                    variant="light"
                    size="lg"
                    radius="md"
                  >
                    <IconTarget size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed">
                      Track Session 2
                    </Text>
                    <Text fw={500} size="lg">
                      {getTrackName(selectionInfo?.selections.track2)}
                    </Text>
                  </div>
                </Group>
                {selectionInfo?.selections.track2 && (
                  <Badge color={getTrackColor(selectionInfo.selections.track2)} variant="light">
                    Selected
                  </Badge>
                )}
              </Group>
            </Paper>

            {/* Edit Button */}
            <Group justify="center" h="100%">
              <Tooltip label={selectionInfo?.hasSubmitted ? 'View selections' : 'Edit selections'}>
                <ActionIcon
                  variant="light"
                  size="xl"
                  onClick={() => setModalOpened(true)}
                  disabled={selectionInfo?.hasSubmitted}
                >
                  <IconEdit size={24} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </SimpleGrid>
        </Paper>
      </Container>

      <TrackSelectionModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        currentSelections={{
          track1: selectionInfo?.selections.track1,
          track2: selectionInfo?.selections.track2,
          panel: selectionInfo?.selections.panel,
        }}
        hasSubmitted={selectionInfo?.hasSubmitted}
      />
    </>
  );
}
