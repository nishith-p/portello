'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Alert,
  Box,
  Card,
  Container,
  Grid,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  Transition,
} from '@mantine/core';

export const PreApprovedDashboard = () => {
  // const { permissions, isLoading } = useKindeBrowserClient();
  //
  // const isAdmin = permissions?.permissions?.includes('dx:admin');
  // const isApproved = permissions?.permissions?.includes('delegate:approved');

  return (
    <Container fluid p="md" style={{ minHeight: '100vh', position: 'relative' }}>
      {/*<Transition mounted={isLoading || false} transition="fade" duration={400}>*/}
      {/*  {(styles) => (*/}
      {/*    <LoadingOverlay visible style={styles} />*/}
      {/*  )}*/}
      {/*</Transition>*/}
      <Stack gap="lg">
        <Box>
          <Title order={2} c="gray.8">
            {/*{isAdmin && 'Welcome, Admin!'}*/}
            {/*{isApproved && 'Welcome, Approved!'}*/}
            Hello, Delegate! 👋
          </Title>
          <Text c="dimmed" mt="xs">
            Thank you for submitting your initial information.
          </Text>
        </Box>

        <Grid>
          <Grid.Col>
            <Card withBorder>
              <Stack>
                <Title order={3} c="gray.7">
                  Registration Status
                </Title>
                <Alert variant="light" color="yellow" title="Under Review">
                  Your application is being reviewed by the Delegates Experience Team. You will
                  receive full access to the portal once approved. This usually takes 2-3 business
                  days.
                </Alert>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

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
