'use client';

import type React from 'react';
import { useState } from 'react';
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
  Group,
  Paper,
  rem,
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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface PaymentFormProps {
  actionUrl: string;
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  customer?: Customer; // Make customer optional since users will input their info
  hash: string;
}

export function PaymentForm({
  actionUrl,
  merchantId,
  orderId,
  amount,
  currency,
  customer,
  hash,
}: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with customer data if available
  const form = useForm({
    initialValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      city: customer?.city || '',
      country: customer?.country || '',
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

  const handleSubmit = (e: React.FormEvent) => {
    const isValid = form.validate().hasErrors === false;

    if (!isValid) {
      e.preventDefault();
      return;
    }

    setIsSubmitting(true);
    // The form will be submitted naturally
  };

  const { useOrder } = useOrderHooks();
  const { data: order, isLoading, error } = useOrder(orderId);

  return (
    <Container size="lg" px="xs">
      <Card shadow="md" radius="md" withBorder p="xl">
        <Card.Section bg="blue.0" p="md" withBorder>
          <Group gap="xs">
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
              <IconCreditCard size={24} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="lg">
                Payment Details
              </Text>
              <Text c="dimmed" size="sm">
                Complete your order #{orderId} payment securely
              </Text>
            </Box>
          </Group>
        </Card.Section>

        <Group mt="lg">
          <SimpleGrid cols={2}>
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

              <form method="post" action={actionUrl} onSubmit={handleSubmit}>
                {/* Required fields */}
                <input type="hidden" name="merchant_id" value={merchantId} />
                <input type="hidden" name="return_url" value={process.env.NEXT_PUBLIC_RETURN_URL} />
                <input type="hidden" name="cancel_url" value={process.env.NEXT_PUBLIC_CANCEL_URL} />
                <input type="hidden" name="notify_url" value={process.env.PAYHERE_NOTIFY_URL} />
                <input type="hidden" name="order_id" value={orderId} />
                <input type="hidden" name="items" value={`Order ${orderId}`} />
                <input type="hidden" name="currency" value={currency} />
                <input type="hidden" name="amount" value={amount} />
                <input type="hidden" name="hash" value={hash} />

                {/* Customer details as visible inputs */}
                <Stack gap="md">
                  <SimpleGrid cols={2}>
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

                  <SimpleGrid cols={2}>
                    <TextInput
                      label="City"
                      placeholder="Enter your city"
                      leftSection={<IconBuilding size={16} />}
                      required
                      name="city"
                      {...form.getInputProps('city')}
                    />
                    <TextInput
                      label="Country"
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
        </Group>
      </Card>
    </Container>
  );
}
