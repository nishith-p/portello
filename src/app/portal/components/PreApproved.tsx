// src/components/PreApprovedDashboard/index.tsx
'use client';

import { Alert, Box, Card, Container, Grid, Stack, Text, Title } from '@mantine/core';

interface PreApprovedDashboardProps {
  isAdmin?: boolean;
  isApproved?: boolean;
}

export const PreApprovedDashboard = ({ isAdmin, isApproved }: PreApprovedDashboardProps) => {
  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        {/* Welcome Message */}
        <Box>
          <Title order={2} c="gray.8">
            {isAdmin && 'Welcome, Admin!'}
            {isApproved && 'Welcome, Approved!'}
          </Title>
          <Text c="dimmed" mt="xs">
            Thank you for submitting your initial information.
          </Text>
        </Box>

        <Grid>
          {/* Status Card */}
          <Grid.Col>
            <Card withBorder>
              <Stack>
                <Title order={3} c="gray.7">
                  Registration Status
                </Title>
                <Alert variant="light" color="yellow" title="Under Review">
                  Your application is being reviewed by the Delegates Experience Team. You will receive full access to
                  the portal once approved. This usually takes 2-3 business days.
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
      </Stack>
    </Container>
  );
};