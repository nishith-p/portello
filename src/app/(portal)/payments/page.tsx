// (portal)/payments/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Container, Stack, Text, Title } from '@mantine/core';
import { getUserByKindeId } from '@/lib/users/db';
import { DelegatePaymentCard } from './(components)/delegate-payment-card';

export default async function DelegatePaymentPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const userProfile = await getUserByKindeId(user.id);
  if (!userProfile) {
    throw new Error('User profile not found');
  }

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} c="gray.8" fz={{ base: 'h3', sm: 'h2' }}>
          Delegate Fee Payment
        </Title>
        <Text c="dimmed" fz={{ base: 'sm', sm: 'md' }}>
          All delegates are required to pay the delegate fee to complete registration.
        </Text>

        <DelegatePaymentCard user={userProfile} />
      </Stack>
    </Container>
  );
}
