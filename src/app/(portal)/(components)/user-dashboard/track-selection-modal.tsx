'use client';

import React, { useState } from 'react';
import {
  Modal,
  Button,
  Stack,
  Text,
  Paper,
  Group,
  Badge,
  Radio,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { IconCheck, IconUsers, IconAlertCircle } from '@tabler/icons-react';
import { useTrackSelection, useTrackStats } from '@/lib/users/hooks';
import { TRACKS } from './const-ysf-tracks';

interface TrackSelectionModalProps {
  opened: boolean;
  onClose: () => void;
  currentTrack?: string | null;
  hasSubmitted?: boolean;
}

export function TrackSelectionModal({
  opened,
  onClose,
  currentTrack,
  hasSubmitted = false,
}: TrackSelectionModalProps) {
  const [selectedTrack, setSelectedTrack] = useState<string>(currentTrack || '');
  
  const { data: trackStats, isLoading: statsLoading } = useTrackStats();
  const { mutate: updateTrack, isPending: isUpdating } = useTrackSelection();

  const handleSubmit = () => {
    if (!selectedTrack) return;
    
    updateTrack(
      { track: selectedTrack },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const getTrackSlots = (trackId: string) => {
    if (!trackStats) return { current: 0, max: 0 };
    const track = TRACKS.find(t => t.id === trackId);
    return {
      current: trackStats[trackId] || 0,
      max: track?.maxSlots || 0,
    };
  };

  const isTrackFull = (trackId: string) => {
    if (!trackStats) return false;
    const slots = getTrackSlots(trackId);
    return slots.current >= slots.max;
  };

  const canSubmit = selectedTrack && !hasSubmitted && !isTrackFull(selectedTrack);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Your Track"
      size="lg"
      centered
      closeOnEscape={!isUpdating}
      closeOnClickOutside={!isUpdating}
    >
      <LoadingOverlay visible={statsLoading || isUpdating} />
      
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Choose the track that best aligns with your interests and career goals. 
          {hasSubmitted && " You have already submitted your selection and cannot change it."}
        </Text>

        {hasSubmitted && currentTrack && (
          <Alert
            icon={<IconCheck size={16} />}
            title="Track Already Selected"
            color="green"
            variant="light"
          >
            You have already selected the <strong>{TRACKS.find(t => t.id === currentTrack)?.name}</strong> track.
          </Alert>
        )}

        <Radio.Group
          value={selectedTrack}
          onChange={setSelectedTrack}
        >
          <Stack gap="sm">
            {TRACKS.map((track) => {
              const slots = getTrackSlots(track.id);
              const isFull = isTrackFull(track.id);
              const isCurrentSelection = selectedTrack === track.id;
              const isDisabled = hasSubmitted || (isFull && !isCurrentSelection);

              return (
                <Paper
                  key={track.id}
                  withBorder
                  p="md"
                  style={{
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled && !isCurrentSelection ? 0.6 : 1,
                    borderColor: isCurrentSelection ? `var(--mantine-color-${track.color}-6)` : undefined,
                    borderWidth: isCurrentSelection ? 2 : 1,
                  }}
                  onClick={() => !isDisabled && setSelectedTrack(track.id)}
                >
                  <Group justify="space-between" align="flex-start">
                    <Group align="flex-start" gap="md" style={{ flex: 1 }}>
                      <Radio
                        value={track.id}
                        disabled={isDisabled}
                        color={track.color}
                        style={{ marginTop: 2 }}
                      />
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Group justify="space-between" align="center">
                          <Text fw={600} size="lg" c={track.color}>
                            {track.name}
                          </Text>
                          <Group gap="xs">
                            <Badge
                              color={track.color}
                              variant="light"
                              leftSection={<IconUsers size={12} />}
                            >
                              {slots.current}/{slots.max}
                            </Badge>
                            {isFull && (
                              <Badge color="red" variant="filled" size="sm">
                                Full
                              </Badge>
                            )}
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
            })}
          </Stack>
        </Radio.Group>

        {!hasSubmitted && (
          <>
            {selectedTrack && isTrackFull(selectedTrack) && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Track Full"
                color="red"
                variant="light"
              >
                This track is currently full. Please select another track.
              </Alert>
            )}

            <Group justify="flex-end" gap="sm">
              <Button variant="outline" onClick={onClose} disabled={isUpdating}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                loading={isUpdating}
                color={selectedTrack ? TRACKS.find(t => t.id === selectedTrack)?.color : 'blue'}
              >
                {currentTrack ? 'Update Selection' : 'Confirm Selection'}
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
