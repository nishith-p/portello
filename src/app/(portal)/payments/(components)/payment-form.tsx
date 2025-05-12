'use client';

import React, { useState } from 'react';
import {
  IconArrowRight,
  IconBuilding,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Divider,
  Grid,
  GridCol,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Transition,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ENTITIES } from '@/app/(portal)/admin/delegates/(components)/constants';
import { useDelegatePaymentDetails, useUserPaymentStatus } from '@/lib/users/hooks';

interface Customer {
  first_name: string;
  last_name: string;
  aiesec_email: string;
  position: string;
}

interface PaymentFormProps {
  currency: string;
  customer?: Customer;
}

export function PaymentForm({ currency, customer }: PaymentFormProps) {
  const queryClient = useQueryClient();
const { data: paymentStatus } = useUserPaymentStatus();
const { data: paymentDetails, isLoading, error } = useDelegatePaymentDetails();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: customer?.first_name || '',
      lastName: customer?.last_name || '',
      email: customer?.aiesec_email || '',
      phone: '',
      address: '',
      city: '',
      country: '',
    },
    validate: {
      firstName: (value) => (value.trim().length < 2 ? 'First name is required' : null),
      lastName: (value) => (value.trim().length < 2 ? 'Last name is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      phone: (value) => (value.trim().length < 6 ? 'Valid phone number is required' : null),
      address: (value) => (value.trim().length < 3 ? 'Address is required' : null),
      city: (value) => (value.trim().length < 2 ? 'City is required' : null),
      country: (value) => (value.trim().length < 2 ? 'Country is required' : null),
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/delegate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegatePayment'] });
      notifications.show({
        title: 'Payment Created',
        message: 'Your payment has been initialized',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create payment',
        color: 'red',
      });
    },
  });

  // Update the handlePayNow function:
  const handlePayNow = form.onSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      // Proceed directly to payment gateway integration
      const res = await fetch('/api/payhere/create-delegate-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            phone: values.phone,
            address: values.address,
            city: values.city,
            country: values.country,
            position: customer?.position || '',
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { actionUrl, fields } = await res.json();
      const formEl = document.createElement('form');
      formEl.method = 'POST';
      formEl.action = actionUrl;

      Object.entries(fields).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(val);
        formEl.appendChild(input);
      });

      document.body.appendChild(formEl);
      formEl.submit();
    } catch (err) {
      console.error(err);
      notifications.show({
        title: 'Payment Error',
        message: err instanceof Error ? err.message : 'Failed to process payment',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const amount = customer?.position && ['MCPc', 'MCPe'].includes(customer.position) ? 100 : 70;

  return (
    <Grid>
      {/* Customer Information Form Section */}
      <GridCol span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
        <Paper withBorder p="md" radius="md">
          <Group mb="xs">
            <ThemeIcon size="md" radius="xl" variant="light" color="blue">
              <IconUser size={18} />
            </ThemeIcon>
            <Text fw={600} size="sm">
              Personal Information
            </Text>
          </Group>

          <Divider my="sm" />

          <form method="post" onSubmit={handlePayNow}>
            <Stack gap="md">
              <SimpleGrid cols={{ sm: 1, md: 2 }}>
                <TextInput
                  label="First Name"
                  placeholder="John"
                  required
                  name="first_name"
                  {...form.getInputProps('firstName')}
                />

                <TextInput
                  label="Last Name"
                  placeholder="Doe"
                  required
                  name="last_name"
                  {...form.getInputProps('lastName')}
                />
              </SimpleGrid>

              <TextInput
                label="Email Address"
                placeholder="e.g. john@email.com"
                leftSection={<IconMail size={16} />}
                required
                name="email"
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Phone Number"
                leftSection={<IconPhone size={16} />}
                required
                name="phone"
                {...form.getInputProps('phone')}
              />

              <TextInput
                label="Address"
                placeholder="Unit 1, 123 Main Street"
                leftSection={<IconMapPin size={16} />}
                required
                name="address"
                {...form.getInputProps('address')}
              />

              <SimpleGrid cols={{ sm: 1, md: 2 }}>
                <TextInput
                  label="City"
                  leftSection={<IconBuilding size={16} />}
                  required
                  name="city"
                  {...form.getInputProps('city')}
                />

                <Select
                  label="Country/Territory"
                  leftSection={<IconWorld size={16} />}
                  required
                  name="country"
                  data={ENTITIES}
                  searchable
                  {...form.getInputProps('country')}
                />
              </SimpleGrid>
            </Stack>

            <Transition mounted transition="slide-up" duration={400} timingFunction="ease">
              {(styles) => (
                <Button
                  style={styles}
                  type="submit"
                  fullWidth
                  size="lg"
                  radius="md"
                  color="blue"
                  loading={isSubmitting || createPaymentMutation.isPending}
                  mt="md"
                  rightSection={
                    !(isSubmitting || createPaymentMutation.isPending) && (
                      <IconArrowRight size={24} />
                    )
                  }
                >
                  {isSubmitting || createPaymentMutation.isPending
                    ? 'Processing...'
                    : 'Pay Securely'}
                </Button>
              )}
            </Transition>
          </form>
        </Paper>
      </GridCol>

      {/* Delegate Payment Summary Section */}
      <GridCol span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
        <Paper withBorder p="md" radius="md">
          <Group mb="xs" justify="apart">
            <Group gap="xs">
              <ThemeIcon size="md" radius="xl" variant="light" color="blue">
                <IconUser size={18} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                Delegate Fee Summary
              </Text>
            </Group>
            <Badge
              color={
                paymentStatus === 'paid'
                  ? 'green'
                  : paymentStatus === 'pending'
                    ? 'yellow'
                    : 'red'
              }
              variant="light"
            >
              {paymentStatus?.toUpperCase() || 'PENDING'}
            </Badge>
          </Group>

          <Divider my="sm" />

          {isLoading ? (
            <Text size="sm" c="dimmed">
              Loading payment details...
            </Text>
          ) : error ? (
            <Text size="sm" c="red">
              {error.message}
            </Text>
          ) : (
            <Stack gap="xs">
              <Group justify="apart">
                <Text c="dimmed" size="sm">
                  Position:
                </Text>
                <Text fw={500}>{customer?.position || 'Unknown'}</Text>
              </Group>

              <Group justify="apart">
                <Text c="dimmed" size="sm">
                  Fee Type:
                </Text>
                <Text fw={500}>
                  {customer?.position && ['MCPc', 'MCPe'].includes(customer.position)
                    ? 'MCP Delegate Fee (€100)'
                    : 'Standard Delegate Fee (€70)'}
                </Text>
              </Group>

              <Divider my="sm" variant="dashed" />

              <Group justify="apart">
                <Text fw={700} size="md">
                  Total Amount:
                </Text>
                <Text fw={700} size="md" c="blue">
                  {currency} {amount.toFixed(2)}
                </Text>
              </Group>

              {paymentStatus === 'paid' && paymentDetails.payment_id && (
                <>
                  <Divider my="sm" variant="dashed" />
                  <Group justify="apart">
                    <Text c="dimmed" size="sm">
                      Transaction ID:
                    </Text>
                    <Text fw={500}>{paymentDetails.payment_id}</Text>
                  </Group>
                </>
              )}
            </Stack>
          )}
        </Paper>
      </GridCol>
    </Grid>
  );
}
