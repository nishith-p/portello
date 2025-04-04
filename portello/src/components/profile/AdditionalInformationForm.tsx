import { Card, Stack, Text, Title } from '@mantine/core';

export const AdditionalInformationForm = () => {
  return (
    <Card withBorder style={{ opacity: 0.6 }}>
      <Stack>
        <Title order={3} c="gray.7">Additional Information</Title>
        <Text c="dimmed" size="sm">
          Additional delegate information will be available here after your registration is approved.
        </Text>
      </Stack>
    </Card>
  );
};