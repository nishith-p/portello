import { Container, Stack, Text, Title } from '@mantine/core';
import { getOrderById } from '@/lib/payhere/paymentRepository';
import { PaymentForm } from '../(components)/payment-form';

type Params = Promise<{ orderId: string }>;

type OrderDetails = Awaited<ReturnType<typeof getOrderById>>;

export default async function OrderPage({ params }: { params: Params }) {
  const { orderId } = await params;
  const orderDetails: OrderDetails = await getOrderById(orderId);

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} c="gray.8" fz={{ base: 'h3', sm: 'h2' }}>
          Checkout
        </Title>
        <Text c="dimmed" fz={{ base: 'sm', sm: 'md' }}>
          Complete your order payment securely. You will be sent an email containing the receipt once the payment is successful.
        </Text>
        <PaymentForm
          orderId={orderId}
          amount={orderDetails.total_amount}
          currency="EUR"
          customer={orderDetails.users?.[0]}
        />
      </Stack>
    </Container>
  );
}
