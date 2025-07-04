'use client';

import React, { useState, useEffect } from 'react';
import { IconCalendar, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { useAgenda } from '@/lib/agenda/hooks';
import { Day } from '@/lib/agenda/types';

const getActivityColor = (type?: string) => {
  const colors: Record<string, string> = {
    keynote: 'grape',
    workshop: 'grape',
    panel: 'grape',
    break: 'gray',
    networking: 'grape',
    'special event': 'yellow',
    plenary: 'green',
    'pai election': 'red',
    wll: 'orange',
    a2030: 'lime',
    ysf: 'grape',
    default: 'gray',
  };

  if (!type) return colors.default;
  const normalizedType = type.toLowerCase();
  return colors[normalizedType] || colors.default;
};

const getRoleColor = (roles: string[]) => {
  const roleColors: Record<string, string> = {
    MCP: 'blue',
    LCP: 'green',
    LCVP: 'lime',
    MCVP: 'orange',
    'MCVP GV': 'orange',
    'MCVP GT': 'orange',
    'MCVP MXP': 'orange',
    'MCVP OD': 'orange',
    'MCVP FIN': 'orange',
    'MCVP BD': 'orange',
    'MCVP EwA': 'orange',
    'MCVP PR': 'orange',
    'MCVP MKT': 'orange',
    Alumni: 'pink',
    All: 'gray',
  };

  if (roles.includes('All') || roles.includes('all')) {
    return 'gray';
  }

  for (const role of roles) {
    if (roleColors[role]) {
      return roleColors[role];
    }
    if (role.startsWith('MCVP')) {
      return roleColors['MCVP'];
    }
  }

  return 'gray';
};

const getUsedTimeSlots = (sessions: any[]) => {
  const usedTimes = new Set<string>();

  sessions.forEach((session) => {
    const startTime = session.start_time;
    const endTime = session.end_time;

    const isStartEarlyMorning = startTime >= '00:00' && startTime < '07:00';
    const isEndEarlyMorning = endTime >= '00:00' && endTime < '07:00';

    if (!isStartEarlyMorning) usedTimes.add(startTime);
    if (!isEndEarlyMorning) usedTimes.add(endTime);
  });

  return Array.from(usedTimes).sort((a, b) => {
    const timeA = a.split(':').map(Number);
    const timeB = b.split(':').map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });
};

const createTimeSlotPairs = (usedTimes: string[]) => {
  const pairs: string[] = [];
  for (let i = 0; i < usedTimes.length - 1; i++) {
    pairs.push(`${usedTimes[i]} - ${usedTimes[i + 1]}`);
  }
  return pairs;
};

const findTimeSlotIndex = (timeSlots: string[], time: string) => {
  return timeSlots.findIndex((slot) => {
    const slotStart = slot.split(' - ')[0];
    return slotStart === time;
  });
};

const calculateDuration = (timeSlots: string[], startTime: string, endTime: string) => {
  const startIndex = findTimeSlotIndex(timeSlots, startTime);
  let endIndex = findTimeSlotIndex(timeSlots, endTime);

  if (endIndex === -1) {
    endIndex = timeSlots.findIndex((slot) => {
      const slotEnd = slot.split(' - ')[1];
      return slotEnd === endTime;
    });
    if (endIndex !== -1) {
      endIndex += 1;
    }
  }

  if (startIndex === -1 || endIndex === -1) return 1;
  return endIndex - startIndex;
};

const renderActivityCard = (activity: any, dayColor: string, isMobile: boolean = false) => {
  const isCommon = activity.targetRoles.includes('All') || activity.targetRoles.includes('all');
  const activityType = activity.type || 'default';
  const isBreak = activityType.toLowerCase() === 'break';

  const typeColor = getActivityColor(activityType);
  const roleColor = getRoleColor(activity.targetRoles);
  const backgroundColor =
    activityType !== 'default'
      ? `var(--mantine-color-${typeColor}-1)`
      : isCommon
        ? `var(--mantine-color-${dayColor}-0)`
        : `var(--mantine-color-${roleColor}-1)`;

  const tooltipContent = (
    <Stack gap="xs">
      <Text fw={600} size="sm">
        {activity.title}
      </Text>
      <Text size="xs" c="dimmed">
        {activity.start_time} - {activity.end_time}
      </Text>
      {!isCommon && activity.targetRoles.length > 0 && (
        <Group gap="xs">
          <Text size="xs" c="dimmed">
            Roles:
          </Text>
          {activity.targetRoles.map((role: string) => {
            const specificRoleColor = getRoleColor([role]);
            return (
              <Badge key={role} size="xs" variant="transparent" color={specificRoleColor}>
                {role}
              </Badge>
            );
          })}
        </Group>
      )}
    </Stack>
  );

  const cardContent = (
    <Paper
      p={isMobile ? 'xs' : 'sm'}
      shadow="sm"
      h="100%"
      style={{
        backgroundColor,
        border: `2px solid var(--mantine-color-${typeColor}-6)`,
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      <Stack gap="xs" h="100%">
        <Group justify="space-between" align="flex-start">
          <Text fw={600} size={isMobile ? 'xs' : 'sm'} lineClamp={isMobile ? 2 : undefined}>
            {activity.title}
          </Text>
          <Group justify="space-between" align="flex-end" gap={isMobile ? 'xs' : 'sm'}>
            {!isCommon && !isBreak && (
              <Group gap="xs">
                {activity.targetRoles.map((role: string) => {
                  const specificRoleColor = getRoleColor([role]);
                  return (
                    <Badge key={role} size="xs" variant="filled" color={specificRoleColor}>
                      {role}
                    </Badge>
                  );
                })}
              </Group>
            )}
            {!isBreak && activityType !== 'default' && activity.show_badges !== false && (
              <Badge size="xs" color={typeColor} variant="filled">
                {activityType}
              </Badge>
            )}
          </Group>
        </Group>
      </Stack>
    </Paper>
  );

  if (isMobile) {
    return cardContent;
  }

  return (
    <Tooltip
      label={tooltipContent}
      position="top"
      withArrow
      multiline
      w={300}
      transitionProps={{ duration: 200 }}
      arrowSize={8}
    >
      {cardContent}
    </Tooltip>
  );
};

const timeRangesOverlap = (start1: string, end1: string, start2: string, end2: string) => {
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const start1Minutes = parseTime(start1);
  const end1Minutes = parseTime(end1);
  const start2Minutes = parseTime(start2);
  const end2Minutes = parseTime(end2);

  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

const groupSessionsByTime = (sessions: any[]) => {
  const groups: any[][] = [];
  const processed = new Set<number>();

  sessions.forEach((session, index) => {
    if (processed.has(index)) return;

    const overlappingSessions = [session];
    processed.add(index);

    sessions.forEach((otherSession, otherIndex) => {
      if (otherIndex === index || processed.has(otherIndex)) return;

      const hasOverlap = timeRangesOverlap(
        session.start_time,
        session.end_time,
        otherSession.start_time,
        otherSession.end_time
      );

      if (hasOverlap) {
        overlappingSessions.push(otherSession);
        processed.add(otherIndex);
      }
    });

    groups.push(overlappingSessions);
  });

  return groups;
};

const MobileAgendaView = ({ day }: { day: Day }) => {
  const sortedSessions = [...day.sessions].sort((a, b) => {
    const timeA = a.start_time.split(':').map(Number);
    const timeB = b.start_time.split(':').map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });

  const sessionGroups = groupSessionsByTime(sortedSessions);

  return (
    <Stack gap="md">
      {sessionGroups.map((group, groupIndex) => {
        const isParallelTracks = group.length > 1;
        const hasCommonSession = group.some(
          (session) => session.targetRoles.includes('All') || session.targetRoles.includes('all')
        );

        if (isParallelTracks && !hasCommonSession) {
          const containerColor = day.color;

          return (
            <Paper
              key={`group-${groupIndex}`}
              shadow="md"
              p="md"
              radius="lg"
              style={{
                background: `linear-gradient(135deg, var(--mantine-color-${containerColor}-1) 0%, var(--mantine-color-${containerColor}-0) 100%)`,
                border: `2px solid var(--mantine-color-${containerColor}-4)`,
              }}
            >
              <Group justify="center" mb="sm">
                <Badge
                  size="lg"
                  variant="light"
                  color={containerColor}
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 700,
                  }}
                >
                  Parallel Tracks
                </Badge>
              </Group>

              <Stack gap="sm">
                {group.map((session, sessionIndex) => {
                  const activityType = session.type || 'default';
                  const typeColor = getActivityColor(activityType);
                  const roleColor = getRoleColor(session.targetRoles);
                  const isCommon =
                    session.targetRoles.includes('All') || session.targetRoles.includes('all');

                  const cardBackgroundColor =
                    activityType !== 'default'
                      ? `var(--mantine-color-${typeColor}-1)`
                      : isCommon
                        ? `var(--mantine-color-${day.color}-0)`
                        : `var(--mantine-color-${roleColor}-1)`;

                  return (
                    <Paper
                      key={`${groupIndex}-${sessionIndex}`}
                      shadow="sm"
                      p="sm"
                      radius="md"
                      style={{
                        backgroundColor: cardBackgroundColor,
                        border: `2px solid var(--mantine-color-${typeColor}-6)`,
                      }}
                    >
                      <Stack gap="sm">
                        <Text size="xs" c="dimmed" mb="md" fw={500}>
                          {session.start_time} - {session.end_time}
                        </Text>
                        <Text fw={600} size="sm" style={{ flex: 1 }}>
                          {session.title}
                        </Text>

                        {session.targetRoles.map((role: string) => {
                          if (role === 'All' || role === 'all') return null;
                          const specificRoleColor = getRoleColor([role]);
                          return (
                            <Badge key={role} size="xs" variant="filled" color={specificRoleColor}>
                              {role}
                            </Badge>
                          );
                        })}

                        {session.type && session.type !== 'default' && (
                          <Badge size="sm" color={getActivityColor(session.type)} variant="light">
                            {session.type}
                          </Badge>
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </Paper>
          );
        } else {
          return group.map((session, sessionIndex) => {
            const activityType = session.type || 'default';
            const typeColor = getActivityColor(activityType);
            const roleColor = getRoleColor(session.targetRoles);
            const isCommon =
              session.targetRoles.includes('All') || session.targetRoles.includes('all');

            const cardBackgroundColor =
              activityType !== 'default'
                ? `var(--mantine-color-${typeColor}-1)`
                : isCommon
                  ? `var(--mantine-color-${day.color}-0)`
                  : `var(--mantine-color-${roleColor}-1)`;

            return (
              <Paper
                key={`single-${groupIndex}-${sessionIndex}`}
                shadow="sm"
                p="md"
                radius="md"
                style={{
                  backgroundColor: cardBackgroundColor,
                  border: `2px solid var(--mantine-color-${typeColor}-6)`,
                }}
              >
                <Group justify="space-between" mb="sm">
                  <Text size="xs" c="dimmed" ta="center" mb="md" fw={500}>
                    {session.start_time} - {session.end_time}
                  </Text>
                  <Group gap="xs">
                    {session.targetRoles.map((role: string) => {
                      if (role === 'All' || role === 'all') return null;
                      const specificRoleColor = getRoleColor([role]);
                      return (
                        <Badge key={role} size="xs" variant="filled" color={specificRoleColor}>
                          {role}
                        </Badge>
                      );
                    })}
                  </Group>
                </Group>

                <Text fw={500} mb="xs">
                  {session.title}
                </Text>

                {session.type && session.type !== 'default' && (
                  <Badge size="sm" color={getActivityColor(session.type)} variant="light">
                    {session.type}
                  </Badge>
                )}
              </Paper>
            );
          });
        }
      })}
    </Stack>
  );
};

const getActivitiesWithPlacement = (day: Day, relevantTimeSlots: string[]) => {
  return day.sessions.map((activity) => {
    const startIndex = findTimeSlotIndex(relevantTimeSlots, activity.start_time);
    const duration = calculateDuration(relevantTimeSlots, activity.start_time, activity.end_time);

    let startCol: number;
    let span: number;

    if (activity.targetRoles.includes('All') || activity.targetRoles.includes('all')) {
      startCol = 0;
      span = day.tracks.length;
    } else {
      const targetIndices: number[] = [];

      activity.targetRoles.forEach((role: string) => {
        if (role === 'MCVP') {
          const mcvpIndices = day.tracks
            .map((track, index) => (track.name.startsWith('MCVP') ? index : -1))
            .filter((index) => index !== -1);
          targetIndices.push(...mcvpIndices);
        } else {
          const trackIndex = day.tracks.findIndex((track) => {
            if (track.name === role) return true;
            if (role.startsWith('MCVP') && track.name.startsWith('MCVP')) {
              const roleSpecific = role.replace('MCVP ', '').trim();
              const trackSpecific = track.name.replace('MCVP ', '').trim();
              return (
                trackSpecific === roleSpecific ||
                trackSpecific.includes(roleSpecific) ||
                roleSpecific.includes(trackSpecific)
              );
            }
            return track.name.includes(role) || role.includes(track.name);
          });

          if (trackIndex !== -1) {
            targetIndices.push(trackIndex);
          }
        }
      });

      const uniqueTargetIndices = new Set(targetIndices);
      const uniqueIndices = Array.from(uniqueTargetIndices).sort((a, b) => a - b);

      if (uniqueIndices.length > 0) {
        startCol = uniqueIndices[0];
        span = uniqueIndices[uniqueIndices.length - 1] - uniqueIndices[0] + 1;
      } else {
        startCol = 0;
        span = 1;
      }
    }

    return {
      ...activity,
      startIndex,
      duration,
      startCol,
      span,
    };
  });
};

const AgendaGridView = ({ day, isMobile }: { day: Day; isMobile: boolean }) => {
  const usedTimes = getUsedTimeSlots(day.sessions);
  const relevantTimeSlots = createTimeSlotPairs(usedTimes);
  const activitiesWithPlacement = getActivitiesWithPlacement(day, relevantTimeSlots);

  const getColumnWidth = (trackCount: number) => {
    if (trackCount <= 4) return 'minmax(200px, 1fr)';
    if (trackCount <= 6) return 'minmax(150px, 1fr)';
    if (trackCount <= 8) return 'minmax(120px, 1fr)';
    return 'minmax(100px, 1fr)';
  };

  const columnWidth = getColumnWidth(day.tracks.length);

  if (isMobile) {
    return <MobileAgendaView day={day} />;
  }

  return (
    <ScrollArea>
      <Box style={{ minWidth: day.tracks.length > 6 ? '1200px' : '800px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `120px repeat(${day.tracks.length}, ${columnWidth})`,
            gridTemplateRows: `auto repeat(${relevantTimeSlots.length}, minmax(60px, auto))`,
            gap: '4px',
            position: 'relative',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'contents' }}>
            <Paper
              p="sm"
              bg="gray.1"
              style={{
                gridColumn: '1',
                gridRow: '1',
                position: 'sticky',
                top: 0,
                zIndex: 20,
              }}
            >
              <Text fw={600} ta="center" size="sm">
                Time
              </Text>
            </Paper>

            {day.tracks.map((track, index) => (
              <Paper
                key={track.id}
                p="xs"
                bg={`${day.color}.1`}
                style={{
                  gridColumn: index + 2,
                  gridRow: '1',
                  position: 'sticky',
                  top: 0,
                  zIndex: 20,
                }}
              >
                <Text fw={600} ta="center" size="xs" lineClamp={3}>
                  {track.name}
                </Text>
              </Paper>
            ))}
          </div>

          {/* Time slots */}
          {relevantTimeSlots.map((timeSlot, timeIndex) => (
            <Paper
              key={timeSlot}
              p="xs"
              bg="gray.0"
              style={{
                gridColumn: '1',
                gridRow: timeIndex + 2,
                display: 'flex',
                alignItems: 'center',
                minHeight: '60px',
                position: 'sticky',
                left: 0,
                zIndex: 15,
              }}
            >
              <Text size="xs" fw={500} ta="center" w="100%" lineClamp={3}>
                {timeSlot}
              </Text>
            </Paper>
          ))}

          {/* Empty grid cells */}
          {relevantTimeSlots.map((_, timeIndex) =>
            day.tracks.map((_, trackIndex) => (
              <Paper
                key={`empty-${timeIndex}-${trackIndex}`}
                bg="gray.0"
                style={{
                  gridColumn: trackIndex + 2,
                  gridRow: timeIndex + 2,
                  border: '1px dashed #ddd',
                  opacity: 0.3,
                  minHeight: '60px',
                }}
              />
            ))
          )}

          {/* Activity cards */}
          {activitiesWithPlacement
            .filter((activity) => activity.startIndex !== -1)
            .map((activity, index) => (
              <div
                key={`${activity.id}-${index}`}
                style={{
                  gridColumn: `${activity.startCol + 2} / span ${activity.span}`,
                  gridRow: `${activity.startIndex + 2} / span ${activity.duration}`,
                  zIndex: 10,
                  position: 'relative',
                  minHeight: '60px',
                }}
              >
                {renderActivityCard(activity, day.color, false)}
              </div>
            ))}
        </div>
      </Box>
    </ScrollArea>
  );
};

const DayOverview = ({ day, isMobile }: { day: Day; isMobile: boolean }) => (
  <Paper
    shadow="xs"
    p={isMobile ? 'md' : 'lg'}
    radius="md"
    mb="lg"
    style={{
      background: `linear-gradient(135deg, var(--mantine-color-${day.color}-0) 0%, var(--mantine-color-${day.color}-1) 100%)`,
      border: `1px solid var(--mantine-color-${day.color}-3)`,
    }}
  >
    <Group justify="space-between" mb="md" wrap={isMobile ? 'wrap' : 'nowrap'}>
      <div style={{ flex: 1 }}>
        <Title order={isMobile ? 3 : 2} c={day.color} mb="xs">
          {day.title}
        </Title>
        <Text size={isMobile ? 'md' : 'lg'} fw={500} c="dimmed">
          {day.description}
        </Text>
      </div>
      <Group>
        <ThemeIcon size={isMobile ? 'lg' : 'xl'} variant="light" color={day.color}>
          <IconCalendar size={isMobile ? 20 : 24} />
        </ThemeIcon>
        <Text size={isMobile ? 'lg' : 'xl'} fw={700} c={day.color}>
          {day.date}
        </Text>
      </Group>
    </Group>
  </Paper>
);

const AgendaWithTrackGrid = () => {
  const { days, loading, error } = useAgenda();
  const [activeTab, setActiveTab] = useState<string>('day0');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading agenda...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Text c="red">Error: {error}</Text>
      </Container>
    );
  }

  if (!days.length) {
    return (
      <Container size="xl" py="xl">
        <Text>No agenda data available</Text>
      </Container>
    );
  }

  // Convert days array to object with day0, day1, etc. keys
  const agendaData = days.reduce((acc, day, index) => {
    acc[`day${index}`] = day;
    return acc;
  }, {} as Record<string, Day>);

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md" ta={isMobile ? 'center' : 'left'}>
        IC 2025 Conference Agenda
      </Title>

      <Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)} mb="xl">
        <Tabs.List grow={!isMobile} variant={isMobile ? 'pills' : 'default'}>
          {Object.entries(agendaData).map(([key, day]) => (
            <Tabs.Tab
              key={key}
              value={key}
              color={day.color}
              leftSection={
                <ThemeIcon size="xs" variant="light" color={day.color}>
                  <IconCalendar size={10} />
                </ThemeIcon>
              }
            >
              <Box ta="center">
                <Text size="xs" fw={700}>
                  {isMobile
                    ? day.title.split(' - ')[0].replace('Day ', 'D')
                    : day.title.split(' - ')[0]}
                </Text>
                <Text size="xs" c="dimmed">
                  {day.date}
                </Text>
              </Box>
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {Object.entries(agendaData).map(([key, day]) => (
          <Tabs.Panel key={key} value={key} pt="lg">
            <DayOverview day={day} isMobile={isMobile} />
            <Container size="xl" p={isMobile ? 'xs' : 'md'}>
              <AgendaGridView day={day} isMobile={isMobile} />
            </Container>
          </Tabs.Panel>
        ))}
      </Tabs>

      <Paper shadow="sm" p="md" radius="md" mt="xl">
        <Group justify="space-between" wrap={isMobile ? 'wrap' : 'nowrap'}>
          <Button
            variant="light"
            leftSection={<IconChevronLeft size={16} />}
            onClick={() => {
              const days = Object.keys(agendaData);
              const currentIndex = days.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(days[currentIndex - 1]);
              }
            }}
            disabled={activeTab === 'day0'}
            size={isMobile ? 'sm' : 'md'}
          >
            Previous Day
          </Button>

          <Group>
            <Text size="sm" c="dimmed">
              Day {parseInt(activeTab.replace('day', '')) + 1} of {Object.keys(agendaData).length}
            </Text>
          </Group>

          <Button
            variant="light"
            rightSection={<IconChevronRight size={16} />}
            onClick={() => {
              const days = Object.keys(agendaData);
              const currentIndex = days.indexOf(activeTab);
              if (currentIndex < days.length - 1) {
                setActiveTab(days[currentIndex + 1]);
              }
            }}
            disabled={activeTab === Object.keys(agendaData)[Object.keys(agendaData).length - 1]}
            size={isMobile ? 'sm' : 'md'}
          >
            Next Day
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default AgendaWithTrackGrid;