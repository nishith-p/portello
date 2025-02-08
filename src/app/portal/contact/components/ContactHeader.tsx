import { Box, Text, Title } from '@mantine/core';

export const ContactHeader = () => {
  return (
    <Box>
      <Title order={2} c="gray.8">
        Contact Information
      </Title>
      <Text c="dimmed" mt="xs">
        Get in touch with the IC 2025 Team
      </Text>
    </Box>
  );
};
