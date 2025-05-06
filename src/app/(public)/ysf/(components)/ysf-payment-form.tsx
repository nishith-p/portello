'use client';

import React from 'react';
import {
  IconArrowRight,
  IconBuilding,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShoppingCart,
  IconUser,
  IconWorld,
  IconAlertCircle
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
  Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ENTITIES } from '@/app/(portal)/admin/delegates/(components)/constants';
import { useCheckout } from '@/lib/ysf/hooks';
import { CustomerInfo } from '@/lib/ysf/types';

interface PaymentFormProps {
  orderId: string;
  packageId: string;
  amount: number;
  quantity: number;
  customer?: {
    first_name?: string;
    last_name?: string;
    aiesec_email?: string;
  };
}

export function YsfPaymentForm({
  orderId,
  packageId,
  amount,
  quantity,
  customer,
}: PaymentFormProps) {
  const { processPayment, isProcessing, error } = useCheckout();

  const form = useForm<CustomerInfo>({
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
      country: (value) => (value.length < 2 ? 'Country is required' : null),
    },
  });

  const handlePayNow = form.onSubmit(async (values) => {
    // Format the data for the API call
    const customerData = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      country: values.country,
    };

    // Process the payment using our custom hook
    await processPayment({
      orderId,
      packageId,
      customer: values,
      quantity,
      total_amount: 0
    });
  });
  
  return (
    <Grid>
      {/* Customer Information Form Section */}
      <GridCol span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
        <Paper withBorder p="md" radius="md">
          <Group mb="xs">
            <ThemeIcon size="md" radius="xl" variant="light" color="#7552CC">
              <IconUser size={18} />
            </ThemeIcon>
            <Text fw={600} size="sm">
              Personal Information
            </Text>
          </Group>

          <Divider my="sm" />
          
          {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Payment Error" 
              color="red" 
              mb="md"
            >
              {error}
            </Alert>
          )}

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
                  color="#7552CC"
                  loading={isProcessing}
                  mt="md"
                  rightSection={!isProcessing && <IconArrowRight size={24} />}
                >
                  {isProcessing ? 'Processing...' : 'Pay Securely'}
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
              <ThemeIcon size="md" radius="xl" variant="light" color="#7552CC">
                <IconShoppingCart size={18} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                Order Summary
              </Text>
            </Group>
            <Badge color="#7552CC" variant="light">
              Pending
            </Badge>
          </Group>

          <Divider my="sm" />
          
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
                <Group justify="space-between">
                  <Text size="sm">
                    {packageId} (x{quantity})
                  </Text>
                  <Text size="sm">Rs. {amount.toFixed(2)}</Text>
                </Group>
              </Stack>
            </Group>

            <Divider my="sm" variant="dashed" />

            <Group justify="apart">
              <Text fw={700} size="md">
                Total:
              </Text>
              <Text fw={700} size="md" c="#7552CC">
                Rs. {(amount * quantity).toFixed(2)}
              </Text>
            </Group>
          </Stack>
        </Paper>
      </GridCol>
    </Grid>
  );
}