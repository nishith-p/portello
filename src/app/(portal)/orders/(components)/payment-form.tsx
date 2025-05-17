// (portal)/orders/(components)/payment-form.tsx
'use client';

import React, { useState } from 'react';
import {
  IconArrowRight,
  IconBuilding,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShoppingCart,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
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
import { ENTITIES } from '@/app/(portal)/admin/delegates/(components)/constants';
import { useOrderHooks } from '@/lib/store/orders/hooks';

interface Customer {
  first_name: string;
  last_name: string;
  aiesec_email: string;
}

interface PaymentFormProps {
  orderId: string;
  currency: string;
  customer?: Customer;
  amount: number;
}

export function PaymentForm({ orderId, currency, customer, amount }: PaymentFormProps) {
  const { useOrder, usePayhereCheckout } = useOrderHooks();
  const { data: order, isLoading, error } = useOrder(orderId);
  const payhereCheckout = usePayhereCheckout();
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

  const handlePayNow = form.onSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const { actionUrl, fields } = await payhereCheckout.mutateAsync({
        orderId,
        customer: {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
        },
      });

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
    } finally {
      setIsSubmitting(false);
    }
  });

  const isDelegateFeeOrder = order?.items?.some((item) => item.item_code === 'DELEGATE_FEE');

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
                  loading={isSubmitting}
                  mt="md"
                  rightSection={!isSubmitting && <IconArrowRight size={24} />}
                >
                  {isSubmitting ? 'Processing..' : 'Pay Securely'}
                </Button>
              )}
            </Transition>
          </form>
        </Paper>
      </GridCol>

      {/* Order Summary Section */}
      <GridCol span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
        <Paper withBorder p="md" radius="md">
          <Group mb="xs" justify="apart">
            <Group gap="xs">
              <ThemeIcon size="md" radius="xl" variant="light" color="blue">
                <IconShoppingCart size={18} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                {isDelegateFeeOrder ? 'Summary' : 'Order Summary'}
              </Text>
            </Group>
            <Badge color="blue" variant="light">
              {order?.status || 'Pending'}
            </Badge>
          </Group>

          <Divider my="sm" />

          {isLoading ? (
            <Text size="sm" c="dimmed">
              Loading...
            </Text>
          ) : error ? (
            <Text size="sm" c="red">
              {error.message}
            </Text>
          ) : order ? (
            <Stack gap="xs">
              <Group justify="apart">
                <Text c="dimmed" size="sm">
                  {isDelegateFeeOrder ? 'Reference ID:' : 'Order ID:'}
                </Text>
                <Text fw={500}>{orderId}</Text>
              </Group>
              {isDelegateFeeOrder ? null : (
                <Group align="start" justify="apart">
                  <Text c="dimmed" size="sm">
                    Items:
                  </Text>
                  <Stack gap="xs">
                    {order.items?.map((item) => (
                      <Group key={item.id} justify="space-between">
                        <Text size="sm">
                          {item.name} (x{item.quantity})
                          {isDelegateFeeOrder && item.description && (
                            <Text size="xs" c="dimmed">
                              {item.description}
                            </Text>
                          )}
                        </Text>
                        <Text size="sm">
                          {currency} {(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Group>
              )}

              <Divider variant="dashed" />

              <Group justify="apart">
                <Text fw={700} size="md">
                  Total:
                </Text>
                <Text fw={700} size="md" c="blue">
                  {currency} {amount.toFixed(2)}
                </Text>
              </Group>
            </Stack>
          ) : null}
        </Paper>
      </GridCol>
    </Grid>
  );
}
