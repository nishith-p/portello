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
  LoadingOverlay,
} from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import { useAllTrackStats, useUpdateSelections } from '@/lib/users/hooks';
import { PANELS, Track, TRACKS } from './const-ysf-tracks';

interface TrackSelectionModalProps {
  opened: boolean;
  onClose: () => void;
  currentSelections?: {
    track1?: string | null;
    track2?: string | null;
    panel?: string | null;
  };
  hasSubmitted?: boolean;
}

export function TrackSelectionModal({
  opened,
  onClose,
  currentSelections = {},
  hasSubmitted = false,
}: TrackSelectionModalProps) {
  const [selections, setSelections] = useState({
    track1: currentSelections?.track1 || '',
    track2: currentSelections?.track2 || '',
    panel: currentSelections?.panel || '',
  });

  const { data: stats, isLoading: statsLoading } = useAllTrackStats();
  const { mutate: updateSelections, isPending: isUpdating } = useUpdateSelections();

  const handleSubmit = () => {
    if (!selections.track1 || !selections.track2 || !selections.panel) return;
    
    updateSelections(selections, {
      onSuccess: () => onClose(),
    });
  };

  const getTrackSlots = (trackId: string, session: 'track1' | 'track2') => {
    if (!stats) return { current: 0, max: 0 };
    const track = TRACKS.find(t => t.id === trackId);
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
    const panel = PANELS.find(p => p.id === panelId);
    return (stats.panelStats[panelId] || 0) >= (panel?.maxSlots || 0);
  };

  const canSubmit = selections.track1 && selections.track2 && selections.panel && !hasSubmitted;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Your Sessions"
      size="lg"
      centered
      closeOnEscape={!isUpdating}
      closeOnClickOutside={!isUpdating}
    >
      <LoadingOverlay visible={statsLoading || isUpdating} />
      
      <Stack gap="xl" p="md">
        {/* Panel Discussion */}
        <div>
          <Text size="lg" fw={600} mb="sm">Panel Discussion</Text>
          <Radio.Group
            value={selections.panel}
            onChange={(value) => setSelections(prev => ({ ...prev, panel: value }))}
          >
            <Stack gap="sm">
              {PANELS.map((panel) => {
                const isFull = isPanelFull(panel.id);
                const isDisabled = hasSubmitted || isFull;
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
                    onClick={() => !isDisabled && setSelections(prev => ({ ...prev, panel: panel.id }))}
                  >
                    <Group justify="space-between">
                      <Group>
                        <Radio 
                          value={panel.id}
                          disabled={isDisabled}
                        />
                        <Stack gap={0}>
                          <Text fw={500}>{panel.name}</Text>
                          <Text size="sm" c="dimmed">{panel.description}</Text>
                        </Stack>
                      </Group>
                      <Group gap="xs">
                        <Badge
                          variant="light"
                          leftSection={<IconUsers size={12} />}
                        >
                          {(stats?.panelStats[panel.id] || 0)}/{panel.maxSlots}
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
          <Text size="lg" fw={600} mb="sm">Track Session 1</Text>
          <Radio.Group
            value={selections.track1}
            onChange={(value) => setSelections(prev => ({ ...prev, track1: value }))}
          >
            <Stack gap="sm">
              {TRACKS.map((track) => (
                <TrackOption 
                  key={`track1-${track.id}`}
                  track={track}
                  selected={selections.track1 === track.id}
                  disabled={hasSubmitted || isTrackFull(track.id, 'track1')}
                  currentSlots={stats?.track1Stats[track.id] || 0}
                  onClick={() => !hasSubmitted && !isTrackFull(track.id, 'track1') && 
                    setSelections(prev => ({ ...prev, track1: track.id }))}
                />
              ))}
            </Stack>
          </Radio.Group>
        </div>

        {/* Track Session 2 */}
        <div>
          <Text size="lg" fw={600} mb="sm">Track Session 2</Text>
          <Radio.Group
            value={selections.track2}
            onChange={(value) => setSelections(prev => ({ ...prev, track2: value }))}
          >
            <Stack gap="sm">
              {TRACKS.map((track) => (
                <TrackOption 
                  key={`track2-${track.id}`}
                  track={track}
                  selected={selections.track2 === track.id}
                  disabled={hasSubmitted || isTrackFull(track.id, 'track2')}
                  currentSlots={stats?.track2Stats[track.id] || 0}
                  onClick={() => !hasSubmitted && !isTrackFull(track.id, 'track2') && 
                    setSelections(prev => ({ ...prev, track2: track.id }))}
                />
              ))}
            </Stack>
          </Radio.Group>
        </div>

        {!hasSubmitted && (
          <Group justify="flex-end">
            <Button variant="outline" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              loading={isUpdating}
            >
              Confirm Selections
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
}

function TrackOption({ track, selected, disabled, currentSlots, onClick }: {
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
          <Radio
            value={track.id}
            disabled={disabled}
            color={track.color}
          />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between" align="center">
              <Text fw={600} c={track.color}>{track.name}</Text>
              <Group gap="xs">
                <Badge
                  color={track.color}
                  variant="light"
                  leftSection={<IconUsers size={12} />}
                >
                  {currentSlots}/{track.maxSlots}
                </Badge>
                {isFull && <Badge color="red">Full</Badge>}
              </Group>
            </Group>
            <Text size="sm" c="dimmed">{track.description}</Text>
          </Stack>
        </Group>
      </Group>
    </Paper>
  );
}
