'use client';

import React, { useState } from 'react';
import {
  IconArrowRight,
  IconBuilding,
  IconCreditCard,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShoppingCart,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Transition,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useOrderHooks } from '@/lib/store/orders/hooks';

interface Customer {
  first_name: string;
  last_name: string;
  aiesec_email: string;
}

interface PaymentFormProps {
  orderId: string;
  amount: string;
  currency: string;
  customer?: Customer;
}

export function PaymentForm({ orderId, currency, customer}: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { useOrder } = useOrderHooks();
  console.log(customer)
  const { data: order, isLoading, error } = useOrder(orderId);

  // Initialize form with customer data if available
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
      const res = await fetch('/api/payhere/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customer: {
            first_name: values.firstName,
            last_name:  values.lastName,
            email:      values.email,
            phone:      values.phone,
            address:    values.address,
            city:       values.city,
            country:    values.country,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');
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
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Container size="lg" px="xs">
      <Card shadow="md" radius="md" withBorder p="xl">
        <Card.Section bg="blue.0" p="md">
          <Group gap="xs">
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
              <IconCreditCard size={24} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="lg">
                Payment Details
              </Text>
              <Text c="dimmed" size="sm">
                Complete your order payment securely
              </Text>
            </Box>
          </Group>
        </Card.Section>

        <Flex mt="lg" justify="center">
          <SimpleGrid cols={{sm: 1, md: 2}}>
            {/* Order Summary Section */}
            <Paper withBorder p="md" radius="md">
              <Group mb="xs" justify="apart">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" variant="light" color="blue">
                    <IconShoppingCart size={18} />
                  </ThemeIcon>
                  <Text fw={600} size="sm">
                    Order Summary
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
                      Order ID:
                    </Text>
                    <Text fw={500}>{orderId}</Text>
                  </Group>

                  <Group align="start" justify="apart">
                    <Text c="dimmed" size="sm">
                      Items:
                    </Text>
                    <Stack gap="xs">
                      {order.items?.map((item) => (
                        <Group key={item.id} justify="space-between">
                          <Text size="sm">
                            {item.name} (x{item.quantity})
                          </Text>
                          <Text size="sm">
                            {currency} {(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Group>

                  <Divider my="sm" variant="dashed" />

                  <Group justify="apart">
                    <Text fw={700} size="md">
                      Total:
                    </Text>
                    <Text fw={700} size="md" color="blue">
                      {currency} {order.total_amount.toFixed(2)}
                    </Text>
                  </Group>
                </Stack>
              ) : null}
            </Paper>

            {/* Customer Information Form Section */}
            <Paper withBorder p="md" radius="md">
              <Group mb="xs">
                <ThemeIcon size="md" radius="xl" variant="light" color="blue">
                  <IconUser size={18} />
                </ThemeIcon>
                <Text fw={600} size="sm">
                  Your Information
                </Text>
              </Group>

              <Divider my="sm" />

              <form method="post" onSubmit={handlePayNow}>
                {/* Customer details as visible inputs */}
                <Stack gap="md">
                  <SimpleGrid cols={{sm: 1, md: 2}}>
                    <TextInput
                      label="First Name"
                      placeholder="Enter your first name"
                      leftSection={<IconUser size={16} />}
                      required
                      name="first_name"
                      {...form.getInputProps('firstName')}
                    />
                    <TextInput
                      label="Last Name"
                      placeholder="Enter your last name"
                      leftSection={<IconUser size={16} />}
                      required
                      name="last_name"
                      {...form.getInputProps('lastName')}
                    />
                  </SimpleGrid>

                  <TextInput
                    label="Email Address"
                    placeholder="your@email.com"
                    leftSection={<IconMail size={16} />}
                    required
                    name="email"
                    {...form.getInputProps('email')}
                  />

                  <TextInput
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    leftSection={<IconPhone size={16} />}
                    required
                    name="phone"
                    {...form.getInputProps('phone')}
                  />

                  <TextInput
                    label="Address"
                    placeholder="Enter your street address"
                    leftSection={<IconMapPin size={16} />}
                    required
                    name="address"
                    {...form.getInputProps('address')}
                  />

                  <SimpleGrid cols={{sm: 1, md: 2}}>
                    <TextInput
                      label="City"
                      placeholder="Enter your city"
                      leftSection={<IconBuilding size={16} />}
                      required
                      name="city"
                      {...form.getInputProps('city')}
                    />
                    <TextInput
                      label="Countries & Territories"
                      placeholder="Select your country"
                      leftSection={<IconWorld size={16} />}
                      required
                      name="country"
                      {...form.getInputProps('country')}
                    />
                  </SimpleGrid>
                </Stack>

                <Transition
                  mounted={true}
                  transition="slide-up"
                  duration={400}
                  timingFunction="ease"
                >
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
                      {isSubmitting ? 'Processing Payment...' : 'Pay Now'}
                    </Button>
                  )}
                </Transition>
              </form>
            </Paper>
          </SimpleGrid>
        </Flex>
      </Card>
    </Container>
  );
}
