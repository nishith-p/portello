import { useState } from 'react';
import {
  Button,
  Container,
  Divider,
  Group,
  NativeSelect,
  Notification,
  Paper,
  Radio,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';

export default function DelegateInfoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [countryValue, setCountryValue] = useState('');
  const [roleValue, setRoleValue] = useState('');

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      gender: '',
      aiesecEmail: '',
      personalEmail: '',
      photo: '',
      lc: '',
      country: '',
      role: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      receiveNewsletters: true,
      allowNotifications: false,
    },
    validate: {
      firstName: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      lastName: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      aiesecEmail: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      personalEmail: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      lc: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      country: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      newPassword: (value) =>
        value && value.length < 8 ? 'Password must be at least 8 characters' : null,
      confirmNewPassword: (value, values) =>
        value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating profile with:', values);
      <Notification color="green" title="Profile Updated">
        Your profile settings have been successfully updated.
      </Notification>;
    } catch (error) {
      <Notification color="red" title="Error">
        An error occurred while updating your profile. Please try again.
      </Notification>;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" radius="md" p="xl">
        <Title order={2} mb="xl">
          IC 2025 Registration Form
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
          <Divider my="xs" label="Personal Information" labelPosition="center" />
            <TextInput
              label="First Name"
              placeholder="Your first name"
              required
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Last Name"
              placeholder="Your last name"
              required
              {...form.getInputProps('lastName')}
            />
            <Radio.Group name="gender" label="Gender" withAsterisk>
              <Group mt="xs">
                <Radio value="male" label="Male" />
                <Radio value="female" label="Female" />
              </Group>
            </Radio.Group>
            <Divider my="xs" label="AIESEC Information" labelPosition="center" />
            <TextInput
              label="AIESEC Email"
              placeholder="your@aiesec.com"
              required
              {...form.getInputProps('aiesecEmail')}
            />
            <TextInput
              label="Personal Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps('personalEmail')}
            />
            <NativeSelect
              value={countryValue}
              onChange={(event) => setCountryValue(event.currentTarget.value)}
              withAsterisk
              label="Country"
              data={['Select Country', 'Sri Lanka', 'India', 'Vietnam', 'Thailand', 'Australia']}
            />
            <TextInput
              label="Entity"
              placeholder="Local Committee Name"
              {...form.getInputProps('lc')}
            />
            <NativeSelect
              value={roleValue}
              onChange={(event) => setRoleValue(event.currentTarget.value)}
              withAsterisk
              label="Role in AIESEC"
              data={['Select Role', 'MCP', 'MCVP', 'LCP', 'LCVP', 'Other']}
            />
            <Divider my="xs" label="Other Details" labelPosition="center" />
            <Textarea
              placeholder="Your Expectations from IC 2025"
              label="Expectations"
              autosize
              minRows={2}
              required
            />
            <Textarea
              placeholder="Anything to know"
              label="Anything to know"
              autosize
              minRows={2}
            />

            <Group mt="xl">
              <Button variant="outline" onClick={form.reset}>
                Reset Changes
              </Button>
              <Button type="submit" loading={isLoading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
