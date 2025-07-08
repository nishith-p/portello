'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconInfoCircle, IconUsers } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Container,
  Group,
  List,
  LoadingOverlay,
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useAllTrackStats, useUpdateSelections, useUserSelectionInfo } from '@/lib/users/hooks';
import { PANELS, TRACK1, TRACK2, type Track } from '../(components)/user-dashboard/const-ysf-tracks';

export default function YsfTrackSelectionPage() {
  const router = useRouter();
  const { data: selectionInfo } = useUserSelectionInfo();
  const { data: stats, isLoading: statsLoading } = useAllTrackStats();
  const { mutate: updateSelections, isPending: isUpdating } = useUpdateSelections();

  const [selections, setSelections] = useState({
    track1: selectionInfo?.selections.track1 || '',
    track2: selectionInfo?.selections.track2 || '',
    panel: selectionInfo?.selections.panel || '',
  });

  useEffect(() => {
    if (selectionInfo) {
      setSelections({
        track1: selectionInfo.selections.track1 || '',
        track2: selectionInfo.selections.track2 || '',
        panel: selectionInfo.selections.panel || '',
      });
    }
  }, [selectionInfo]);

  const handleSubmit = () => {
    if (!selections.track1 || !selections.track2 || !selections.panel) return;

    updateSelections(selections, {
      onSuccess: () => router.push('/'), // Redirect to root after successful submission
    });
  };

  const getTrackSlots = (trackId: string, session: 'track1' | 'track2') => {
    if (!stats) return { current: 0, max: 0 };
    const trackArray = session === 'track1' ? TRACK1 : TRACK2;
    const track = trackArray.find((t) => t.id === trackId);
    return {
      current: stats[`${session}Stats`][trackId] || 0,
      max: track?.maxSlots || 0,
    };
  };

  const isTrackFull = (trackId: string, session: 'track1' | 'track2') => {
    const slots = getTrackSlots(trackId, session);
    return slots.current >= slots.max;
  };

  const isPanelFull = (panelId: string) => {
    if (!stats) return false;
    const panel = PANELS.find((p) => p.id === panelId);
    return (stats.panelStats[panelId] || 0) >= (panel?.maxSlots || 0);
  };

  const canSubmit =
    selections.track1 && selections.track2 && selections.panel && !selectionInfo?.hasSubmitted;

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        YouthSpeak Forum 2025 - Session Preference Selection
      </Title>

      {selectionInfo?.hasSubmitted && (
        <Alert variant="light" color="green" icon={<IconInfoCircle />} mb="xl">
          Your selections have been submitted and cannot be changed.
        </Alert>
      )}

      <List size="sm" withPadding c="dimmed" mb='xl'>
        <Stack gap="md">
          <List.Item>
            To help us organize a meaningful and personalized experience for each of our 400
            delegates, we'd love to know your session preferences.
          </List.Item>
          <List.Item>
            Please indicate the panel discussion, Workshop 1, and Workshop 2 sessions you would like
            to attend. Kindly note that:
          </List.Item>
          <List.Item fw={700}>
            ✅ You can only attend one session per category (1 panel + 1 workshop 1 + 1 workshop 2)
          </List.Item>
          <List.Item fw={700}>
            ✅ Selections are first-come, first-served due to limited capacities
          </List.Item>
          <List.Item>Make sure to submit your preferences at your earliest convenience!</List.Item>
        </Stack>
      </List>

      <Paper withBorder radius="md" p="xl" mt='xl'>
        <LoadingOverlay visible={statsLoading || isUpdating} />

        <Stack gap="xl">
          {/* Panel Discussion Section */}
          <div>
            <Title order={2} size="h3" mb="sm">
              Panel Discussion
            </Title>
            <Radio.Group
              value={selections.panel}
              onChange={(value) => setSelections((prev) => ({ ...prev, panel: value }))}
            >
              <Stack gap="sm">
                {PANELS.map((panel) => {
                  const isFull = isPanelFull(panel.id);
                  const isDisabled = selectionInfo?.hasSubmitted || isFull;
                  const isSelected = selections.panel === panel.id;

                  return (
                    <Paper
                      key={panel.id}
                      withBorder
                      p="md"
                      style={{
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled && !isSelected ? 0.6 : 1,
                        borderColor: isSelected ? 'var(--mantine-color-blue-6)' : undefined,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      onClick={() =>
                        !isDisabled && setSelections((prev) => ({ ...prev, panel: panel.id }))
                      }
                    >
                      <Group justify="space-between">
                        <Group>
                          <Radio value={panel.id} disabled={isDisabled} />
                          <Stack gap={0}>
                            <Text fw={500}>{panel.name}</Text>
                            <Text size="sm" c="dimmed">
                              {panel.description}
                            </Text>
                          </Stack>
                        </Group>
                        <Group gap="xs">
                          <Badge variant="light" leftSection={<IconUsers size={12} />}>
                            {stats?.panelStats[panel.id] || 0}/{panel.maxSlots}
                          </Badge>
                          {isFull && <Badge color="red">Full</Badge>}
                        </Group>
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>
            </Radio.Group>
          </div>

          {/* Track Session 1 */}
          <div>
            <Title order={2} size="h3" mb="sm">
              Workshop 1
            </Title>
            <Radio.Group
              value={selections.track1}
              onChange={(value) => setSelections((prev) => ({ ...prev, track1: value }))}
            >
              <Stack gap="sm">
                {TRACK1.map((track) => (
                  <TrackOption
                    key={`track1-${track.id}`}
                    track={track}
                    selected={selections.track1 === track.id}
                    disabled={selectionInfo?.hasSubmitted || isTrackFull(track.id, 'track1')}
                    currentSlots={stats?.track1Stats[track.id] || 0}
                    onClick={() =>
                      !selectionInfo?.hasSubmitted &&
                      !isTrackFull(track.id, 'track1') &&
                      setSelections((prev) => ({ ...prev, track1: track.id }))
                    }
                  />
                ))}
              </Stack>
            </Radio.Group>
          </div>

          {/* Track Session 2 */}
          <div>
            <Title order={2} size="h3" mb="sm">
              Workshop 2
            </Title>
            <Radio.Group
              value={selections.track2}
              onChange={(value) => setSelections((prev) => ({ ...prev, track2: value }))}
            >
              <Stack gap="sm">
                {TRACK2.map((track) => (
                  <TrackOption
                    key={`track2-${track.id}`}
                    track={track}
                    selected={selections.track2 === track.id}
                    disabled={selectionInfo?.hasSubmitted || isTrackFull(track.id, 'track2')}
                    currentSlots={stats?.track2Stats[track.id] || 0}
                    onClick={() =>
                      !selectionInfo?.hasSubmitted &&
                      !isTrackFull(track.id, 'track2') &&
                      setSelections((prev) => ({ ...prev, track2: track.id }))
                    }
                  />
                ))}
              </Stack>
            </Radio.Group>
          </div>

          {!selectionInfo?.hasSubmitted && (
            <Group justify="flex-end" mt="xl">
              <Button
                variant="outline"
                onClick={() => router.push('/')} // Redirect to root on cancel
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!canSubmit} loading={isUpdating} size="md">
                Confirm Selections
              </Button>
            </Group>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

function TrackOption({
  track,
  selected,
  disabled,
  currentSlots,
  onClick,
}: {
  track: Track;
  selected: boolean;
  disabled: boolean;
  currentSlots: number;
  onClick: () => void;
}) {
  const isFull = currentSlots >= track.maxSlots;

  return (
    <Paper
      withBorder
      p="md"
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !selected ? 0.6 : 1,
        borderColor: selected ? `var(--mantine-color-${track.color}-6)` : undefined,
        borderWidth: selected ? 2 : 1,
      }}
      onClick={onClick}
    >
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start" gap="md" style={{ flex: 1 }}>
          <Radio value={track.id} disabled={disabled} color={track.color} />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between" align="center">
              <Stack gap={2}>
                <Text fw={600} c={track.color}>
                  {track.name}
                </Text>
                <Badge size="xs" variant="light" color={track.color}>
                  {track.theme}
                </Badge>
              </Stack>
              <Group gap="xs">
                <Badge color={track.color} variant="light" leftSection={<IconUsers size={12} />}>
                  {currentSlots}/{track.maxSlots}
                </Badge>
                {isFull && <Badge color="red">Full</Badge>}
              </Group>
            </Group>
            <Text size="sm" c="dimmed">
              {track.description}
            </Text>
          </Stack>
        </Group>
      </Group>
    </Paper>
  );
}