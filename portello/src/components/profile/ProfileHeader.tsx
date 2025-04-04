import { Box, Text, Title } from '@mantine/core';

export const ProfileHeader = () => {
  return (
    <Box>
      <Title order={2} c="gray.8">
        Profile Information
      </Title>
      <Text c="dimmed" mt="xs">
        Manage your delegate information for IC 2025
      </Text>
    </Box>
  );
};