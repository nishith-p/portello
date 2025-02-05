'use client';

import { useRouter } from 'next/navigation';
import { Button, Container, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useCreateUser } from '@/lib/mutations/user';

interface OnboardingFormProps {
  kindeUserId: string;
}

export const OnboardingForm = ({ kindeUserId }: OnboardingFormProps) => {
  const router = useRouter();
  const createUser = useCreateUser();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
    },
    validate: {},
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await createUser.mutateAsync({
        kindeUserId,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      });

      notifications.show({
        title: 'Success',
        message: 'Your profile has been created successfully!',
        color: 'green',
      });

      router.push('/portal');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create profile. Please try again.',
        color: 'red',
      });
    }
  });

  return (
    <Container w={400} maw={400}>
      <Title c="#2d333a" ta="center" size={30} mb={30}>
        Let's get onboarded!
      </Title>

      <form onSubmit={handleSubmit}>
        <TextInput
          {...form.getInputProps('firstName')}
          placeholder="First Name"
          size="lg"
          radius="md"
        />
        <TextInput
          {...form.getInputProps('lastName')}
          placeholder="Last Name"
          size="lg"
          radius="md"
          mt="xs"
        />
        <Button
          type="submit"
          mt="lg"
          radius="md"
          fullWidth
          loading={createUser.isPending}
          disabled={createUser.isPending}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};
