'use client';

import { useState } from 'react';
import { Container, Stack, Text, Modal, NumberInput, Button } from '@mantine/core';
import { PricingGrid } from './(components)/pricing-grid';
import { conferencePlans } from '@/lib/ysf/data';
import { useCheckout } from '@/lib/ysf/hooks';
import { PricingPlan } from '@/lib/ysf/types';

export default function YsfPage() {
  const [opened, setOpened] = useState(false);
  const [quantity, setQuantity] = useState<number>(10);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const { handlePlanSelection } = useCheckout();

  const handleSelect = (plan: PricingPlan) => {
    const result = handlePlanSelection(plan);
    
    if (result.requiresQuantity) {
      // For bulk plans, open the quantity modal
      setSelectedPlan(plan);
      setOpened(true);
    }
    // For individual plans, the navigation happens inside handlePlanSelection
  };

  const handleBulkConfirm = () => {
    if (selectedPlan && quantity >= 10) {
      handlePlanSelection(selectedPlan, quantity);
      setOpened(false);
    }
  };

  const handleChange = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    setQuantity(num || 10);
  };

  return (
    <Container size="lg">
      <Stack>
        <PricingGrid
          title="Youth Speak Forum Packages"
          description="Select the plan that best fits you. If you have friends to attend we have bulk offers too."
          plans={conferencePlans}
          onSelect={handleSelect}
        />

        <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
          *Register by 4th May, 2025 and Pay by 19th May, 2025 to be eligible for early bird offer.
        </Text>
        <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
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
        <Button mt="md" fullWidth onClick={handleBulkConfirm} color='#7552CC'>
          Proceed to Checkout
        </Button>
      </Modal>
    </Container>
  );
}