'use client';

import { useEffect, useState } from 'react';
import { IconInfoCircle, IconUsers, IconX } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Group,
  List,
  LoadingOverlay,
  Paper,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAllYSFStats, useCreateYSFSelection, useYSFSelectionInfo } from '@/lib/ysf/hooks';
import { PANELS, TRACK1, TRACK2, type Track } from './const-ysf-tracks';

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function YsfTrackSelectionPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailValidated, setEmailValidated] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { data: selectionInfo, refetch: refetchSelection } = useYSFSelectionInfo(email);
  const { data: stats, isLoading: statsLoading } = useAllYSFStats();
  const { mutate: createSelections, isPending: isCreating } = useCreateYSFSelection();

  const [selections, setSelections] = useState({
    track1: '',
    track2: '',
    panel: '',
    full_name: '',
  });

  useEffect(() => {
    if (selectionInfo) {
      setSelections({
        track1: selectionInfo.selections.track1 || '',
        track2: selectionInfo.selections.track2 || '',
        panel: selectionInfo.selections.panel || '',
        full_name: selectionInfo.full_name || '',
      });
      setHasSubmitted(selectionInfo.hasSubmitted || false);
    }
  }, [selectionInfo]);

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setEmailValidated(true);
    await refetchSelection();
  };

  const handleFormSubmit = async () => {
    if (!selections.track1 || !selections.track2 || !selections.panel) {
      notifications.show({
        title: 'Missing selections',
        message: 'Please select all sessions',
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
      return;
    }

    if (!selections.full_name) {
      notifications.show({
        title: 'Missing name',
        message: 'Please provide your full name',
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
      return;
    }

    try {
      await createSelections({
        email,
        track1: selections.track1,
        track2: selections.track2,
        panel: selections.panel,
        full_name: selections.full_name,
      });

      await refetchSelection();
      setHasSubmitted(true);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save selections',
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
    }
  };

  const handleNewSubmission = () => {
    setEmailValidated(false);
    setHasSubmitted(false);
    setEmail('');
    setSelections({
      track1: '',
      track2: '',
      panel: '',
      full_name: '',
    });
  };

  const getTrackDetails = (trackId: string, session: 'track1' | 'track2') => {
    const trackArray = session === 'track1' ? TRACK1 : TRACK2;
    return trackArray.find((t) => t.id === trackId);
  };

  const getPanelDetails = (panelId: string) => {
    return PANELS.find((p) => p.id === panelId);
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
    selections.track1 &&
    selections.track2 &&
    selections.panel &&
    selections.full_name &&
    !hasSubmitted;

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        YouthSpeak Forum 2025 - Session Preference Selection
      </Title>

      <List size="sm" withPadding c="dimmed" mb="xl">
        <Stack gap="md">
          <List.Item>
            To help us organize a meaningful and personalized experience for each of our delegates,
            we'd love to know your session preferences.
          </List.Item>
          <List.Item>
            Please indicate the panel discussion, Workshop 1, and Workshop 2 sessions you would like
            to attend.
          </List.Item>
          <List.Item fw={700}>
            ✅ You can only attend one session per category (1 panel + 1 workshop 1 + 1 workshop 2)
          </List.Item>
          <List.Item fw={700}>
            ✅ Selections are first-come, first-served due to limited capacities
          </List.Item>
          <List.Item fw={700}>✅ One submission per email address</List.Item>
        </Stack>
      </List>

      {!emailValidated ? (
        <Paper withBorder radius="md" p="xl" mb="xl">
          <Title order={2} size="h3" mb="md">
            Start by entering your email
          </Title>
          <form onSubmit={handleEmailSubmit}>
            <Group align="flex-end">
              <div style={{ flex: 1 }}>
                <TextInput
                  label="Email Address"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  style={{ flex: 1 }}
                  required
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEmailSubmit();
                    }
                  }}
                />
                {emailError && (
                  <Text size="xs" c="red" mt={4} style={{ textAlign: 'left' }}>
                    {emailError}
                  </Text>
                )}
              </div>
              <Button
                type="submit"
                onClick={handleEmailSubmit}
                loading={!selectionInfo && !!email && !emailError}
              >
                Continue
              </Button>
            </Group>
          </form>
        </Paper>
      ) : hasSubmitted ? (
        <>
          <Alert variant="light" color="green" icon={<IconInfoCircle />} mb="xl">
            You have already submitted your selections. Here's a summary of your registration:
          </Alert>

          <Card withBorder shadow="sm" radius="md" mb="xl">
            <Title order={3} mb="md">
              Registration Details
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <div>
                <Text fw={500}>Full Name:</Text>
                <Text>{selections.full_name}</Text>
              </div>
              <div>
                <Text fw={500}>Email:</Text>
                <Text>{email}</Text>
              </div>
            </SimpleGrid>
          </Card>

          <Card withBorder shadow="sm" radius="md" mb="xl">
            <Title order={3} mb="md">
              Your Selected Sessions
            </Title>
            <Stack gap="xl">
              {selections.panel && (
                <div>
                  <Text fw={500} size="lg" mb="sm">
                    Panel Discussion:
                  </Text>
                  <Paper withBorder p="md">
                    <Text fw={600}>{getPanelDetails(selections.panel)?.name}</Text>
                    <Text c="dimmed" mt="xs">
                      {getPanelDetails(selections.panel)?.description}
                    </Text>
                  </Paper>
                </div>
              )}

              {selections.track1 && (
                <div>
                  <Text fw={500} size="lg" mb="sm">
                    Workshop 1:
                  </Text>
                  <Paper withBorder p="md">
                    <Text fw={600}>{getTrackDetails(selections.track1, 'track1')?.name}</Text>
                    <Badge
                      color={getTrackDetails(selections.track1, 'track1')?.color}
                      variant="light"
                      mt="xs"
                    >
                      {getTrackDetails(selections.track1, 'track1')?.theme}
                    </Badge>
                    <Text c="dimmed" mt="xs">
                      {getTrackDetails(selections.track1, 'track1')?.description}
                    </Text>
                  </Paper>
                </div>
              )}

              {selections.track2 && (
                <div>
                  <Text fw={500} size="lg" mb="sm">
                    Workshop 2:
                  </Text>
                  <Paper withBorder p="md">
                    <Text fw={600}>{getTrackDetails(selections.track2, 'track2')?.name}</Text>
                    <Badge
                      color={getTrackDetails(selections.track2, 'track2')?.color}
                      variant="light"
                      mt="xs"
                    >
                      {getTrackDetails(selections.track2, 'track2')?.theme}
                    </Badge>
                    <Text c="dimmed" mt="xs">
                      {getTrackDetails(selections.track2, 'track2')?.description}
                    </Text>
                  </Paper>
                </div>
              )}
            </Stack>
          </Card>

          <Group justify="center" mt="xl">
            <Button 
              variant="outline" 
              onClick={handleNewSubmission}
              size="md"
            >
              Submit Another Response
            </Button>
          </Group>

          <Alert variant="light" color="blue" icon={<IconInfoCircle />} mt="xl">
            If you need to make changes to your selections, please contact the DX team.
          </Alert>
        </>
      ) : (
        <Paper withBorder radius="md" p="xl" mt="xl">
          <LoadingOverlay visible={statsLoading || isCreating} />

          <Stack gap="xl">
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={selections.full_name}
              onChange={(e) => setSelections((prev) => ({ ...prev, full_name: e.target.value }))}
              required
            />

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
                    const isDisabled = isFull;
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
                      disabled={isTrackFull(track.id, 'track1')}
                      currentSlots={stats?.track1Stats[track.id] || 0}
                      onClick={() =>
                        !isTrackFull(track.id, 'track1') &&
                        setSelections((prev) => ({ ...prev, track1: track.id }))
                      }
                    />
                  ))}
                </Stack>
              </Radio.Group>
            </div>

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
                      disabled={isTrackFull(track.id, 'track2')}
                      currentSlots={stats?.track2Stats[track.id] || 0}
                      onClick={() =>
                        !isTrackFull(track.id, 'track2') &&
                        setSelections((prev) => ({ ...prev, track2: track.id }))
                      }
                    />
                  ))}
                </Stack>
              </Radio.Group>
            </div>

            <Group justify="flex-end" mt="xl">
              <Button
                onClick={handleFormSubmit}
                disabled={!canSubmit}
                loading={isCreating}
                size="md"
              >
                Submit Selections
              </Button>
            </Group>
          </Stack>
        </Paper>
      )}
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
