import { useState } from 'react';
import Link from 'next/link';
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';

export default function LoginPage() {
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError('');
    try {
      // This would typically be a server action in Next.js
      // const response = await loginUser(values)
      console.log('Login attempt with:', values);
      // Simulate successful login
      // if (response.ok) {
      //   // Redirect or update state
      // } else {
      //   setError('Login failed. Please check your credentials.')
      // }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account yet?{' '}
        <Link href="/register" passHref>
            Create account
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
        {error && (
          <Text c="red" size="sm" mt="sm">
            {error}
          </Text>
        )}
      </Paper>
    </Container>
  );
}
