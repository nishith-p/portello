'use client';

import { Tabs } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import PrivacyPolicy from './components/Privacy-policy';
import TermsOfUse from './components/Terms-of-use';
import RefundPolicy from './components/Refund-policy';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'delegateFee';

  return (
    <Tabs defaultValue={tab}>
      <Tabs.List>
        <Tabs.Tab value="delegateFee">Delegate Fee</Tabs.Tab>
        <Tabs.Tab value="refundPolicy">Cancellation and Refund Policy</Tabs.Tab>
        <Tabs.Tab value="termsConditions">Terms and Conditions</Tabs.Tab>
        <Tabs.Tab value="privacyPolicy">Privacy and Cookie Policy</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="delegateFee">Delegate Fee tab content</Tabs.Panel>
      <Tabs.Panel value="refundPolicy"><RefundPolicy /></Tabs.Panel>
      <Tabs.Panel value="termsConditions"><TermsOfUse /></Tabs.Panel>
      <Tabs.Panel value="privacyPolicy"><PrivacyPolicy /></Tabs.Panel>
    </Tabs>
  );
}
