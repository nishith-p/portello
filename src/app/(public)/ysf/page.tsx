'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Text, Modal, NumberInput, Button } from '@mantine/core';
import { PricingGrid } from './(components)/pricing-grid';

export default function YsfPage() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [quantity, setQuantity] = useState<number>(10);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const isBulk = (plan: any) => plan.packageId.includes('-b-');

  const handleSelect = (plan: any) => {
    if (isBulk(plan)) {
      setSelectedPlan(plan);
      setOpened(true);
    } else {
      router.push(`/ysf/checkout?packageId=${plan.packageId}`);
    }
  };

  const handleBulkConfirm = () => {
    if (quantity >= 10) {
      router.push(`/ysf/checkout?packageId=${selectedPlan.packageId}&quantity=${quantity}`);
    }
  };

  const handleChange = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    setQuantity(num || 10);
  };
  
  

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

  return (
    <Container size="lg">
      <Stack>
        <PricingGrid
          title="YSF Packages"
          description="Select the plan that best fits you. If you have friends to attend we have bulk offers too."
          plans={conferencePlans}
          onSelect={handleSelect}
        />

        <Text size="sm" c="dimmed" fs="italic">
          *Register by 4th May, 2025 and Pay by 19th May, 2025 to be eligible for early bird offer.
        </Text>
        <Text size="sm" c="dimmed" fs="italic">
          *Bulk offer is valid for 10+ participants from same school, university, or company.
        </Text>
      </Stack>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Enter Quantity (Min: 10)">
        <NumberInput
          label="Number of Participants"
          value={quantity}
          onChange={handleChange}
          min={10}
        />
        <Button mt="md" fullWidth onClick={handleBulkConfirm}>
          Proceed to Checkout
        </Button>
      </Modal>
    </Container>
  );
}
