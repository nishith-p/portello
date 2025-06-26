import React, { useState } from 'react';
import {
  IconBowl,
  IconHome,
  IconMapPin,
  IconUsers,
  IconTarget,
  IconEdit,
} from '@tabler/icons-react';
import {
  Badge,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Button,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { User } from '@/lib/users/types';
import { TrackSelectionModal } from './track-selection-modal';
import { useUserTrackInfo } from '@/lib/users/hooks';

interface QuickInfoCardProps {
  user: User;
}

const TRACK_COLORS: Record<string, string> = {
  employability: 'blue',
  leadership: 'green',
  sustainability: 'teal',
  diversity: 'grape',
};

const TRACK_NAMES: Record<string, string> = {
  employability: 'Employability',
  leadership: 'Leadership',
  sustainability: 'Sustainability',
  diversity: 'Diversity',
};

export function QuickInfoCard({ user }: QuickInfoCardProps) {
  const [trackModalOpened, setTrackModalOpened] = useState(false);
  const { data: trackInfo, isLoading: trackLoading } = useUserTrackInfo();

  return (
    <>
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

            {/* YSF Track Stat */}
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between" align="flex-start">
                <Group>
                  <ThemeIcon
                    color={
                      trackInfo?.userTrack ? TRACK_COLORS[trackInfo.userTrack] : 'gray'
                    }
                    variant="light"
                    size="lg"
                    radius="md"
                  >
                    <IconTarget size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed">
                      YSF Track
                    </Text>
                    <Group gap={8}>
                      <Text fw={500} size="lg">
                        {trackInfo?.userTrack
                          ? TRACK_NAMES[trackInfo.userTrack]
                          : 'Not Selected'}
                      </Text>
                      {trackInfo?.userTrack && (
                        <Badge
                          color={TRACK_COLORS[trackInfo.userTrack]}
                          variant="light"
                          size="sm"
                        >
                          Selected
                        </Badge>
                      )}
                    </Group>
                  </div>
                </Group>
                
                {!trackLoading && (
                  <Tooltip 
                    label={
                      trackInfo?.hasSubmitted 
                        ? "View your track selection" 
                        : "Select your track"
                    }
                  >
                    <ActionIcon
                      variant="light"
                      color={trackInfo?.userTrack ? TRACK_COLORS[trackInfo.userTrack] : 'blue'}
                      onClick={() => setTrackModalOpened(true)}
                    >
                      {trackInfo?.hasSubmitted ? <IconTarget size={16} /> : <IconEdit size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            </Paper>

            {/* Meal Preference Stat */}
            <Paper withBorder p="md" radius="md" style={{ gridColumn: '1 / -1' }}>
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

      <TrackSelectionModal
        opened={trackModalOpened}
        onClose={() => setTrackModalOpened(false)}
        currentTrack={trackInfo?.userTrack}
        hasSubmitted={trackInfo?.hasSubmitted}
      />
    </>
  );
}
