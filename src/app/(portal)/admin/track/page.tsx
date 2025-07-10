'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  Text, 
  LoadingOverlay, 
  Title, 
  MultiSelect, 
  Group, 
  Button,
  Stack,
  Box,
  Pagination,
  ScrollArea,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAllYSFSelections, useUniqueEntities } from '@/lib/users/hooks';
import { TRACK1, TRACK2, PANELS } from '@/app/(portal)/(components)/user-dashboard/const-ysf-tracks';

const PAGE_SIZE = 10;

export default function AdminTrackSelections() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activePage, setActivePage] = useState(1);
  
  // Fetch data
  const { data: users = [], isLoading: usersLoading, error: usersError } = useAllYSFSelections();
  const { data: uniqueEntities = [], isLoading: entitiesLoading } = useUniqueEntities();
  
  // Filter state
  const [entityFilter, setEntityFilter] = useState<string[]>([]);
  const [track1Filter, setTrack1Filter] = useState<string[]>([]);
  const [track2Filter, setTrack2Filter] = useState<string[]>([]);
  const [panelFilter, setPanelFilter] = useState<string[]>([]);

  // Handle errors
  useEffect(() => {
    if (usersError) {
      notifications.show({
        title: 'Error',
        message: usersError.message || 'Failed to load user selections',
        color: 'red',
      });
    }
  }, [usersError]);

  // Filter users based on selections
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const entityMatch = entityFilter.length === 0 || entityFilter.includes(user.entity);
      const track1Match = track1Filter.length === 0 || (user.ysf_track_1 && track1Filter.includes(user.ysf_track_1));
      const track2Match = track2Filter.length === 0 || (user.ysf_track_2 && track2Filter.includes(user.ysf_track_2));
      const panelMatch = panelFilter.length === 0 || (user.ysf_panel && panelFilter.includes(user.ysf_panel));
      
      return entityMatch && track1Match && track2Match && panelMatch;
    });
  }, [users, entityFilter, track1Filter, track2Filter, panelFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, activePage]);

  // Reset to first page when filters change
  useEffect(() => {
    setActivePage(1);
  }, [entityFilter, track1Filter, track2Filter, panelFilter]);

  // Export to CSV with proper encoding
  const exportToCSV = () => {
    const headers = ['Name', 'Entity', 'Workshop 1 ID', 'Workshop 2 ID', 'Panel ID'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        `"${user.full_name.replace(/"/g, '""')}"`,
        `"${user.entity}${user.sub_entity ? ` (${user.sub_entity})` : ''}"`,
        user.ysf_track_1 || '-',
        user.ysf_track_2 || '-',
        user.ysf_panel || '-'
      ].join(','))
    ].join('\n');

    // Create CSV with proper encoding
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ysf-selections-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoading = usersLoading || entitiesLoading;

  return (
    <Stack gap="md" m="xl">
      <Group justify="space-between">
        <Title order={2} size={isMobile ? 'h4' : 'h3'}>Delegate Track Selections</Title>
        <Button 
          onClick={exportToCSV} 
          variant="outline"
          size={isMobile ? 'xs' : 'sm'}
          disabled={filteredUsers.length === 0}
        >
          Export to CSV
        </Button>
      </Group>

      {/* Filters */}
      <Stack gap="sm">
        <MultiSelect
          label="Entity"
          placeholder="Filter entities"
          data={uniqueEntities}
          value={entityFilter}
          onChange={setEntityFilter}
          clearable
          searchable
          size={isMobile ? 'xs' : 'sm'}
        />
        {isMobile ? (
          <>
            <MultiSelect
              label="Workshop 1 ID"
              placeholder="Filter by ID"
              data={TRACK1.map(t => ({ value: t.id, label: t.id }))}
              value={track1Filter}
              onChange={setTrack1Filter}
              clearable
              size="xs"
            />
            <MultiSelect
              label="Workshop 2 ID"
              placeholder="Filter by ID"
              data={TRACK2.map(t => ({ value: t.id, label: t.id }))}
              value={track2Filter}
              onChange={setTrack2Filter}
              clearable
              size="xs"
            />
            <MultiSelect
              label="Panel ID"
              placeholder="Filter by ID"
              data={PANELS.map(p => ({ value: p.id, label: p.id }))}
              value={panelFilter}
              onChange={setPanelFilter}
              clearable
              size="xs"
            />
          </>
        ) : (
          <Group grow>
            <MultiSelect
              label="Workshop 1 ID"
              placeholder="Filter by ID"
              data={TRACK1.map(t => ({ value: t.id, label: t.id }))}
              value={track1Filter}
              onChange={setTrack1Filter}
              clearable
              size="sm"
            />
            <MultiSelect
              label="Workshop 2 ID"
              placeholder="Filter by ID"
              data={TRACK2.map(t => ({ value: t.id, label: t.id }))}
              value={track2Filter}
              onChange={setTrack2Filter}
              clearable
              size="sm"
            />
            <MultiSelect
              label="Panel ID"
              placeholder="Filter by ID"
              data={PANELS.map(p => ({ value: p.id, label: p.id }))}
              value={panelFilter}
              onChange={setPanelFilter}
              clearable
              size="sm"
            />
          </Group>
        )}
      </Stack>

      <Box pos="relative">
        <LoadingOverlay visible={isLoading} />
        
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Delegate</Table.Th>
                <Table.Th>Entity</Table.Th>
                <Table.Th>Workshop 1 ID</Table.Th>
                <Table.Th>Workshop 2 ID</Table.Th>
                <Table.Th>Panel ID</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedUsers.map((user) => (
                <Table.Tr key={user.kinde_id}>
                  <Table.Td>{user.full_name}</Table.Td>
                  <Table.Td>{user.entity}{user.sub_entity ? ` (${user.sub_entity})` : ''}</Table.Td>
                  <Table.Td>{user.ysf_track_1 || '-'}</Table.Td>
                  <Table.Td>{user.ysf_track_2 || '-'}</Table.Td>
                  <Table.Td>{user.ysf_panel || '-'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        
        {!isLoading && filteredUsers.length === 0 && (
          <Text mt="md" c="dimmed">No delegates match your filters</Text>
        )}
      </Box>

      {totalPages > 1 && (
        <Pagination
          value={activePage}
          onChange={setActivePage}
          total={totalPages}
          size={isMobile ? 'sm' : 'md'}
          mt="md"
        />
      )}
    </Stack>
  );
}
