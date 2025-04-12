'use client';

import { Tabs } from '@mantine/core';
import PrivacyPolicy from './components/PrivacyPolicy';

export default function paymentPage() {
  return (
    <Tabs defaultValue="delegateFee">
      <Tabs.List>
        <Tabs.Tab value="delegateFee">Delegate Fee</Tabs.Tab>
        <Tabs.Tab value="returnPolicy">Return Policy</Tabs.Tab>
        <Tabs.Tab value="termsConditions">Terms and Conditions</Tabs.Tab>
        <Tabs.Tab value="privacyPolicy">Privacy and Cookie Policy</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="delegateFee">Delegate Fee tab content</Tabs.Panel>

      <Tabs.Panel value="returnPolicy">Return Policy tab content</Tabs.Panel>

      <Tabs.Panel value="termsConditions">Terms and Conditions tab content</Tabs.Panel>

      <Tabs.Panel value="privacyPolicy"><PrivacyPolicy /></Tabs.Panel>
    </Tabs>
  );
}
