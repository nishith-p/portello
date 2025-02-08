'use client';

import { IconArrowRight, IconBriefcase, IconBuildingSkyscraper } from '@tabler/icons-react';
import {
  Box,
  Button,
  Container,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { ENTITIES, POSITIONS } from '../utils/constants';
import { useOnboardingForm } from '../utils/hooks';

type OnboardingFormProps = {
  kinde_id: string;
  kinde_email: string;
};

export const OnboardingForm = ({ kinde_id, kinde_email }: OnboardingFormProps) => {
  const { form, handleSubmit, isSubmitting } = useOnboardingForm(kinde_id, kinde_email);

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        {/* Information Section */}
        <Box>
          <Title order={2} size="h2" fw={600} mb="xs" ta="center" c="gray.8">
            Let's Get Onboarded!
          </Title>
          <Text c="dimmed" size="sm" mb="lg" ta="center">
            Tell us about yourself. Our Delegates Experience Team will review your application
            shortly.
          </Text>
        </Box>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                {...form.getInputProps('first_name')}
                label="First Name"
                placeholder="Enter your first name"
                required
              />

              <TextInput
                {...form.getInputProps('last_name')}
                label="Last Name"
                placeholder="Enter your last name"
                required
              />
            </Group>

            <Select
              {...form.getInputProps('entity')}
              label="Entity"
              placeholder="Select your entity"
              data={ENTITIES}
              leftSection={<IconBuildingSkyscraper size={16} />}
              searchable
              required
            />

            <Select
              {...form.getInputProps('position')}
              label="Position"
              placeholder="Select your position"
              data={POSITIONS}
              leftSection={<IconBriefcase size={16} />}
              searchable
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              rightSection={!isSubmitting && <IconArrowRight size="1.1rem" />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
