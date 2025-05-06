'use client';

import { useSearchParams } from 'next/navigation';
import { Container, Text, Title } from '@mantine/core';
import { YsfPaymentForm } from '../(components)/ysf-payment-form';

const conferencePlans = [
  {
    packageId: 'scl-eb',
    title: 'School Students & School Leavers',
    price: 1500,
    originalPrice: 2000,
    currency: 'Rs.',
    features: [
      { text: 'Full YSF Access' },
      { text: 'Lunch Included' },
      { text: 'Transportation is available for an additional fee of Rs. 500' },
    ],
    badge: 'Early Bird! *',
    badgeColor: 'red',
    buttonText: 'SELECT',
  },
  {
    packageId: 'uni-eb',
    title: 'Undergraduates',
    price: 2000,
    originalPrice: 2500,
    currency: 'Rs.',
    features: [
      { text: 'Full YSF Access' },
      { text: 'Lunch Included' },
      { text: 'Transportation is available for an additional fee of Rs. 500' },
    ],
    badge: 'Early Bird! *',
    badgeColor: 'red',
    buttonText: 'SELECT',
  },
  {
    packageId: 'corp-eb',
    title: 'Corporates/Open',
    price: 4000,
    originalPrice: 4500,
    currency: 'Rs.',
    features: [
      { text: 'Full YSF Access' },
      { text: 'Lunch Included' },
      { text: 'Transportation Included' },
    ],
    badge: 'Early Bird! *',
    badgeColor: 'red',
    buttonText: 'SELECT',
    highlighted: true,
  },
  {
    packageId: 'scl-b-eb',
    title: 'School Students & School Leavers',
    price: 1300,
    originalPrice: 1800,
    currency: 'Rs.',
    features: [{ text: 'For 10+ participants' }, { text: 'From same school' }],
    badge: 'Bulk Offer! *',
    badgeColor: 'green',
    buttonText: 'SELECT',
  },
  {
    packageId: 'uni-b-eb',
    title: 'Undergraduates',
    price: 1800,
    originalPrice: 2300,
    currency: 'Rs.',
    features: [{ text: 'For 10+ participants' }, { text: 'From same university' }],
    badge: 'Bulk Offer! *',
    badgeColor: 'green',
    buttonText: 'SELECT',
  },
  {
    packageId: 'corp-b-eb',
    title: 'Corporates/Open',
    price: 3800,
    originalPrice: 4300,
    currency: 'Rs.',
    features: [{ text: 'For 10+ participants' }, { text: 'From same company' }],
    badge: 'Bulk Offer! *',
    badgeColor: 'green',
    buttonText: 'SELECT',
  },
];

export default function YsfCheckoutPage() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId');
  const quantity = Number(searchParams.get('quantity')) || 1;

  const selectedPackage = conferencePlans.find((p) => p.packageId === packageId);

  if (!selectedPackage) {
    return (
      <Container>
        <Title order={3}>Invalid Package</Title>
        <Text>The package you selected does not exist.</Text>
      </Container>
    );
  }

  return (
    <Container mt={60}>
      <Title order={2}>Checkout - {selectedPackage.title}</Title>
      <Text mb="md">
        You selected the <strong>{selectedPackage.title}</strong> package for Rs.{' '}
        {selectedPackage.price}.
      </Text>

      <YsfPaymentForm
        orderId={`${selectedPackage.packageId}-${Date.now()}`}
        orderTitle={selectedPackage.title}
        amount={selectedPackage.price}
        quantity={quantity}
      />
    </Container>
  );
}
