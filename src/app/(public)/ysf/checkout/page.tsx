// app/(public)/ysf/checkout/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Title, Text, Alert, Loader, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { YsfPaymentForm } from '../(components)/ysf-payment-form';
import { conferencePlans } from '@/lib/ysf/data';
import { PricingPlan } from '@/lib/ysf/types';
import { useCheckout } from '@/lib/ysf/hooks';

export default function YsfCheckoutPage() {
  const searchParams = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<PricingPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isProcessing, error: checkoutError } = useCheckout();

  useEffect(() => {
    // Get package ID and quantity from URL parameters
    const packageId = searchParams.get('packageId');
    const quantity = Number(searchParams.get('quantity')) || 1;
    
    if (!packageId) {
      setError('No package selected.');
      setLoading(false);
      return;
    }
    
    // Find the selected package
    const foundPackage = conferencePlans.find((p) => p.packageId === packageId);
    
    if (!foundPackage) {
      setError('Invalid package selected.');
      setLoading(false);
      return;
    }
    
    // Check if it's a bulk package and if the quantity is valid
    const isBulk = foundPackage.packageId.includes('-b-');
    if (isBulk && quantity < 10) {
      setError('Bulk packages require at least 10 participants.');
      setLoading(false);
      return;
    }
    
    setSelectedPackage(foundPackage);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <Container mt={60}>
        <Center>
          <Loader size="md" />
          <Text ml="md">Loading checkout information...</Text>
        </Center>
      </Container>
    );
  }

  if (isProcessing) {
    return (
      <Container mt={60}>
        <Center>
          <Loader size="md" />
          <Text ml="md">Processing payment...</Text>
        </Center>
      </Container>
    );
  }

  if (error || !selectedPackage) {
    return (
      <Container mt={60}>
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Checkout Error" 
          color="red"
        >
          {error || 'An unknown error occurred.'}
        </Alert>
      </Container>
    );
  }

  if (checkoutError) {
    return (
      <Container mt={60}>
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Payment Processing Error" 
          color="red"
        >
          {checkoutError}
        </Alert>
      </Container>
    );
  }

  const quantity = Number(searchParams.get('quantity')) || 1;
  const total = selectedPackage.price * quantity;
  const orderId = `YSF-${selectedPackage.packageId}-${Date.now()}`;

  return (
    <Container mt={60}>
      <Title order={2}>Checkout - {selectedPackage.title}</Title>
      <Text mb="md">
        You selected the <strong>{selectedPackage.title}</strong> package 
        {quantity > 1 && ` (${quantity} participants)`} for a total of{' '}
        <strong>Rs. {total.toFixed(2)}</strong>.
      </Text>

      <YsfPaymentForm
        orderId={orderId}
        packageId={selectedPackage.packageId}
        amount={selectedPackage.price}
        quantity={quantity}
      />
    </Container>
  );
}
