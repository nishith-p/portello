// src/components/PreApprovedDashboard/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Grid,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { getUserFirstName, getUserProfile } from '@/lib/actions/user';
import { supabaseClient } from '@/lib/supabase';

interface Delegate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  region: string;
  entity: string;
  lc: string;
  position: string;
  status: string;
}

interface PreApprovedDashboardProps {
  isAdmin?: boolean;
  isApproved?: boolean;
  userId: string;
}

export const PreApprovedDashboard = ({ isAdmin, isApproved, userId }: PreApprovedDashboardProps) => {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [lcFilter, setLcFilter] = useState<string>('all');
  const [firstName, setFirstName] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // isAdmin = true;

  const fetchDelegates = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient.from('users').select('*');

    if (error) {
      setError('Failed to fetch delegate data.');
    } else {
      setDelegates(data);
    }
    setLoading(false);
  };

  const handleApproveSelected = async () => {
    const selectedDelegateIds = Object.keys(selectedRows).filter((id) => selectedRows[id]);

    if (selectedDelegateIds.length === 0) {
      setError('Please select at least one delegate to approve.');
      return;
    }

    setLoading(true);
    try {
      // Update status in Supabase for selected delegates
      const { error } = await supabaseClient
        .from('users')
        .update({ status: 'approved' })
        .in('id', selectedDelegateIds);

      if (error) {
        setError('Failed to update delegate status.');
      } else {
        // Optimistically update the UI
        setDelegates((prev) =>
          prev.map((delegate) =>
            selectedDelegateIds.includes(delegate.id)
              ? { ...delegate, status: 'approved' }
              : delegate
          )
        );
        setSelectedRows({});
        // Fetch delegates again to make sure we have the updated data from Supabase
        fetchDelegates();
      }
    } catch (err) {
      setError('An error occurred while updating delegate status.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value ?? 'all'); // Fallback to 'all' if value is null
  };

  const handleRegionFilterChange = (value: string | null) => {
    setRegionFilter(value ?? 'all');
  };

  const handleLcFilterChange = (value: string | null) => {
    setLcFilter(value ?? 'all');
  };

  const handleEntityFilterChange = (value: string | null) => {
    setEntityFilter(value ?? 'all'); // Fallback to 'all' if value is null
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if(userId){
        const loggedinUser = getUserFirstName(userId);
        setFirstName(await loggedinUser);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchDelegates();
    }
  }, [isAdmin]);

  const filteredDelegates = delegates.filter((delegate) => {
    const statusMatch = statusFilter === 'all' || delegate.status === statusFilter;
    const entityMatch = entityFilter === 'all' || delegate.entity === entityFilter;
    const regionMatch = regionFilter === 'all' || delegate.region === regionFilter;
    const lcMatch = lcFilter === 'all' || delegate.lc === lcFilter;
    return statusMatch && entityMatch && regionMatch && lcMatch;
  });

  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        {/* Welcome Message */}
        <Box>
          <Title order={2} c="gray.8">
            {isAdmin && 'Welcome, Admin!'}
            {isApproved && 'Welcome, Approved!'}
            {firstName && `Welcome, ${firstName}!`}
          </Title>
        </Box>

        {isAdmin ? (
          <Box>
            <Title order={2} c="gray.8">
              Admin Dashboard
            </Title>
            <Text c="dimmed" mt="xs">
              Here is a list of all pre-approved delegates.
            </Text>

            {loading && <Text>Loading delegate details...</Text>}
            {error && <Alert color="red">{error}</Alert>}

            {!loading && !error && (
              <Card withBorder>
                <Stack>
                  <Title order={3} c="gray.7">
                    Delegate List
                  </Title>
                  {/* Filter Controls */}
                  <Grid>
                    <Grid.Col span={6}>
                      <Select
                        label="Status"
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        data={[
                          { value: 'all', label: 'All' },
                          { value: 'pending', label: 'Pending' },
                          { value: 'approved', label: 'Approved' },
                        ]}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Entity"
                        value={entityFilter}
                        onChange={handleEntityFilterChange}
                        data={[{ value: 'all', label: 'All' }, ...delegates.map((d) => d.entity)]}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Region"
                        value={regionFilter}
                        onChange={handleRegionFilterChange}
                        data={[{ value: 'all', label: 'All' }, ...delegates.map((d) => d.region)]}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="LC"
                        value={lcFilter}
                        onChange={handleLcFilterChange}
                        data={[{ value: 'all', label: 'All' }, ...delegates.map((d) => d.lc)]}
                      />
                    </Grid.Col>
                  </Grid>

                  {filteredDelegates.length > 0 ? (
                    <>
                      <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <thead>
                          <tr>
                            <th>
                              <Checkbox
                                onChange={(event) => {
                                  const checked = event.currentTarget.checked;
                                  const newSelection = Object.fromEntries(
                                    filteredDelegates.map((d) => [d.id, checked])
                                  );
                                  setSelectedRows(newSelection);
                                }}
                                checked={filteredDelegates.every((d) => selectedRows[d.id])}
                                indeterminate={
                                  Object.values(selectedRows).some((v) => v) &&
                                  !filteredDelegates.every((d) => selectedRows[d.id])
                                }
                              />
                            </th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Position</th>
                            <th>Region</th>
                            <th>Entity</th>
                            <th>LC</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDelegates.map((delegate) => (
                            <tr key={delegate.id}>
                              <td>
                                <Checkbox
                                  checked={selectedRows[delegate.id] || false}
                                  onChange={() => toggleRow(delegate.id)}
                                />
                              </td>
                              <td>{delegate.first_name}</td>
                              <td>{delegate.last_name}</td>
                              <td>{delegate.position}</td>
                              <td>{delegate.region}</td>
                              <td>{delegate.entity}</td>
                              <td>{delegate.lc}</td>
                              <td>{delegate.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Button
                        mt="md"
                        onClick={handleApproveSelected}
                        disabled={loading || Object.keys(selectedRows).length === 0}
                      >
                        Approve Selected
                      </Button>
                    </>
                  ) : (
                    <Text>No delegates found.</Text>
                  )}
                </Stack>
              </Card>
            )}
          </Box>
        ) : (
          <>
            <Text c="dimmed" mt="xs">
              Thank you for submitting your initial information.
            </Text>
            <Grid>
              {/* Status Card */}
              <Grid.Col>
                <Card withBorder>
                  <Stack>
                    <Title order={3} c="gray.7">
                      Registration Status
                    </Title>
                    <Alert variant="light" color="yellow" title="Under Review">
                      Your application is being reviewed by the Delegates Experience Team. You will
                      receive full access to the portal once approved. This usually takes 2-3
                      business days.
                    </Alert>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>

            {/* What's Next Card */}
            <Card withBorder>
              <Stack>
                <Title order={3} c="gray.7">
                  What's Next?
                </Title>
                <Text size="sm">Once your application is approved, you will gain access to:</Text>
                <ul style={{ marginTop: 0, paddingLeft: '1.5rem' }}>
                  <li>Complete delegate profile management</li>
                  <li>IC 2025 store access</li>
                  <li>Event agenda and booklets</li>
                  <li>Forms and document submissions</li>
                </ul>
              </Stack>
            </Card>
          </>
        )}
      </Stack>
    </Container>
  );
};
