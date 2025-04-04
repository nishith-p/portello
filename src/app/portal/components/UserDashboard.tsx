'use client';

import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, Grid, LoadingOverlay, Stack, Text, Title } from '@mantine/core';
import { DocumentStatusCard } from '@/app/portal/components/DocumentCard';
import { QuickInfoCard } from '@/app/portal/components/QuickInfoCard';
import { UserProfile } from '@/app/portal/components/UserProfile';
import { useCurrentUserProfile } from '@/lib/api/hooks/useUsers';

export const UserDashboard = () => {
  const { data: userProfile, isLoading, error } = useCurrentUserProfile();

  const user = userProfile?.user;
  const userDocuments = userProfile?.documents;

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (error || !user) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading your profile"
        color="red"
        variant="filled"
      >
        {error?.message || "We couldn't load your profile information. Please try again later."}
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Title order={2} c="gray.8" fz={{ base: 'h3', sm: 'h2' }}>
        Welcome back, {user.first_name}! 👋
      </Title>

      <Text c="dimmed" fz={{ base: 'sm', sm: 'md' }}>
        Your account is fully approved. If you want anything to be modified here, please contact the
        DX team.
      </Text>

      <Grid gutter={{ base: 'xs', sm: 'md', md: 'lg' }}>
        <Grid.Col span={{ base: 12, sm: 12, md: 8 }} order={{ base: 2, md: 1 }}>
          <UserProfile user={user} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 12, md: 4 }} order={{ base: 1, md: 2 }}>
          <Stack gap="md">
            <QuickInfoCard user={user} />
            {userDocuments && <DocumentStatusCard documents={userDocuments} />}
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
