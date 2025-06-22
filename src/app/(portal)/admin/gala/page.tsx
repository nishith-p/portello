// app/(portal)/admin/gala/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { IconChevronDown, IconChevronRight, IconInfoCircle, IconSearch } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Collapse,
  Container,
  Group,
  LoadingOverlay,
  Table as MantineTable,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { generateTables } from '@/app/(portal)/gala/page';
import { useAdminGalaSeating } from '@/lib/gala/hooks';
import { EntityBooking } from '@/lib/gala/types';
import { AdminSeatingChart } from './(components)/seating-chart';

export default function AdminGalaPage() {
  const { data, loading, error } = useAdminGalaSeating();
  const tables = generateTables();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Get all entities (both booked and not booked)
  const allEntities = useMemo(() => {
    if (!data) return [];

    // Create a map of all entities from bookings
    const entitiesMap = new Map();

    // Add entities that have bookings
    data.bookingsByEntity.forEach((entity) => {
      entitiesMap.set(entity.entity, entity);
    });

    return Array.from(entitiesMap.values());
  }, [data]);

  // Filter entities based on search
  const filteredEntities = useMemo(() => {
    if (!searchQuery) return allEntities;
    return allEntities.filter((entity) =>
      entity.entity.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allEntities, searchQuery]);

  // Calculate additional stats
  const stats = useMemo(() => {
    if (!data) return { totalEntities: 0, tablesBooked: 0 };

    const bookedTables = new Set();
    data.allBookings.forEach((booking) => {
      bookedTables.add(booking.table);
    });

    return {
      totalEntities: data.totalEntitiesRegistered || 0,
      tablesBooked: bookedTables.size,
    };
  }, [data]);

  const toggleRowExpansion = (entityName: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(entityName)) {
      newExpanded.delete(entityName);
    } else {
      newExpanded.add(entityName);
    }
    setExpandedRows(newExpanded);
  };

  const getBookingStatusColor = (bookedSeats: number, maxSeats: number) => {
    if (bookedSeats === 0) return 'red';
    if (bookedSeats === maxSeats) return 'green';
    if (bookedSeats > maxSeats) return 'purple';
    return 'blue';
  };

  if (error) {
    return (
      <Container>
        <Text c="red">{error}</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Gala Night Admin Dashboard
      </Title>

      <Box pos="relative">
        <LoadingOverlay visible={loading} />

        {/* Summary Statistics */}
        <Paper withBorder p="md" mb="xl">
          <Group justify="space-between" mb="md">
            <Title order={3}>Summary</Title>
          </Group>

          <Group grow>
            <Paper withBorder p="md">
              <Text size="sm" c="dimmed">
                Entities Booked
              </Text>
              <Title order={2}>{data?.totalEntitiesBooked || 0} / {stats.totalEntities}</Title>
            </Paper>

            <Paper withBorder p="md">
              <Text size="sm" c="dimmed">
                Total Seats Booked
              </Text>
              <Title order={2}>
                {data?.totalSeatsBooked || 0} / {tables.length * 12}
              </Title>
            </Paper>

            <Paper withBorder p="md">
              <Text size="sm" c="dimmed">
                Tables Booked
              </Text>
              <Title order={2}>
                {stats.tablesBooked} / {tables.length}
              </Title>
            </Paper>
          </Group>
        </Paper>

        {/* Seating Chart */}
        <AdminSeatingChart bookings={data?.allBookings || []} />

        {/* Bookings by Entity */}
        <Paper withBorder p="md" mb="xl">
          <Group justify="space-between" mb="md">
            <Title order={3}>Bookings by Entity</Title>
            <TextInput
              placeholder="Search entities..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              w={300}
            />
          </Group>

          <ScrollArea>
            <MantineTable striped highlightOnHover>
              <MantineTable.Thead>
                <MantineTable.Tr>
                  <MantineTable.Th w={50}></MantineTable.Th>
                  <MantineTable.Th>Entity</MantineTable.Th>
                  <MantineTable.Th>
                    <Group gap="xs">
                      Seats Status
                      <Tooltip label="Number of seats booked vs maximum allowed">
                        <IconInfoCircle size={14} />
                      </Tooltip>
                    </Group>
                  </MantineTable.Th>
                  <MantineTable.Th>Progress</MantineTable.Th>
                </MantineTable.Tr>
              </MantineTable.Thead>
              <MantineTable.Tbody>
                {filteredEntities.map((entity) => {
                  const isExpanded = expandedRows.has(entity.entity);
                  const statusColor = getBookingStatusColor(entity.bookedSeats, entity.maxSeats);

                  return (
                    <>
                      <MantineTable.Tr key={entity.entity}>
                        <MantineTable.Td>
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={() => toggleRowExpansion(entity.entity)}
                            disabled={entity.bookedSeats === 0}
                          >
                            {entity.bookedSeats > 0 ? (
                              isExpanded ? (
                                <IconChevronDown size={16} />
                              ) : (
                                <IconChevronRight size={16} />
                              )
                            ) : null}
                          </ActionIcon>
                        </MantineTable.Td>
                        <MantineTable.Td>
                          <Text fw={500}>{entity.entity}</Text>
                        </MantineTable.Td>
                        <MantineTable.Td>
                          <Badge variant="outline" color={statusColor}>
                            {entity.bookedSeats} / {entity.maxSeats}
                          </Badge>
                        </MantineTable.Td>
                        <MantineTable.Td>
                          <Box w="100px">
                            <Box h={6} bg="gray.2" style={{ borderRadius: 3, overflow: 'hidden' }}>
                              <Box
                                h="100%"
                                bg={statusColor}
                                style={{
                                  width: `${entity.maxSeats > 0 ? (entity.bookedSeats / entity.maxSeats) * 100 : 0}%`,
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </Box>
                          </Box>
                        </MantineTable.Td>
                      </MantineTable.Tr>

                      {entity.bookedSeats > 0 && (
                        <MantineTable.Tr>
                          <MantineTable.Td colSpan={5} p={0}>
                            <Collapse in={isExpanded}>
                              <Box p="md" bg="gray.0">
                                <Title order={5} mb="sm">
                                  Seat Details
                                </Title>
                                <Group gap="lg">
                                  <Box>
                                    <Text size="sm" fw={500} mb="xs">
                                      Chief Delegate:
                                    </Text>
                                    {entity.delegates.map(
                                      (delegate: EntityBooking['delegates'][0]) => (
                                        <Group key={delegate.id} gap="xs" mb="xs">
                                          <Text size="sm">{delegate.name}</Text>
                                        </Group>
                                      )
                                    )}
                                  </Box>
                                  <Box>
                                    <Text size="sm" fw={500} mb="xs">
                                      Reserved Seats:
                                    </Text>
                                    <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                      {entity.delegates.flatMap(
                                        (delegate: EntityBooking['delegates'][0]) =>
                                          delegate.seats.map(
                                            (seat: { table: number; seat: number }) => (
                                              <Badge
                                                key={`${seat.table}-${seat.seat}`}
                                                variant="light"
                                                size="sm"
                                              >
                                                T{seat.table}S{seat.seat}
                                              </Badge>
                                            )
                                          )
                                      )}
                                    </Box>
                                  </Box>
                                </Group>
                              </Box>
                            </Collapse>
                          </MantineTable.Td>
                        </MantineTable.Tr>
                      )}
                    </>
                  );
                })}
              </MantineTable.Tbody>
            </MantineTable>
          </ScrollArea>
        </Paper>
      </Box>
    </Container>
  );
}
