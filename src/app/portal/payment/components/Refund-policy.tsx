import { Container, Stack, Title, Text, Box, Anchor, List } from "@mantine/core"
import styles from "./Refund-policy.module.css"

export default function RefundPolicy() {
    return (
        <Container size="lg" className={styles.container}>
          <Stack>
            <Title order={1} className={styles.title}>
              Cancellation and Refund Policy<br />AIESEC International Congress 2025
            </Title>
    
            {/* <Text size="sm" className={styles.lastUpdated}>
              Last Updated: 18th April 2025
            </Text> */}
    
            <Box my="lg">
              <Text className={styles.paragraph}>
                This policy outlines the terms and conditions for cancellation and refunds for delegate fees and merchandise
                related to the AIESEC International Congress 2025.
              </Text>
            </Box>
    
            <Title order={2} className={styles.subtitle}>
              1. Delegate Fee Cancellation and Refund Policy:
            </Title>
    
            <Title order={3} className={styles.subsubtitle}>
              1.1. Free Cancellation Period:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                Delegates can cancel their registration free of charge until May 15th, 2025.
              </List.Item>
              <List.Item className={styles.listItem}>
                To initiate a cancellation, please follow the instructions provided on the registration platform.
              </List.Item>
            </List>
    
            <Title order={3} className={styles.subsubtitle}>
              1.2. Exceptions for Delegates Seeking Funding:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                Delegates who communicate in writing to the ILMSC, AIVP Finance, and the Congress Committee (CC) at the
                moment of registration that they are seeking funding may be subject to different cancellation terms. These
                will be assessed on a case-by-case basis.
              </List.Item>
            </List>
    
            <Title order={3} className={styles.subsubtitle}>
              1.3. Cancellation Between May 16th and May 31st, 2025:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                Cancellations made between May 16th, 2025, and May 31st, 2025, will incur a cancellation fee of no more than
                50% of the total delegate fees.
              </List.Item>
            </List>
    
            <Title order={3} className={styles.subsubtitle}>
              1.4. Cancellation After May 31st, 2025:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                Any cancellation made after May 31st, 2025, will incur a cancellation fee equivalent to the full delegate
                fee.
              </List.Item>
            </List>
    
            <Title order={3} className={styles.subsubtitle}>
              1.5. Replacement of Delegates:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                A Member Committee (MC), Official Extension, or Expansion can replace a registered delegate with another
                individual free of charge until May 15th, 2025, subject to the approval of AIESEC International (AI).
              </List.Item>
              <List.Item className={styles.listItem}>
                After May 15th, 2025, any changes to delegate names are at the discretion of the Congress Committee (CC).
                The CC cannot guarantee visa processing for delegates changed after this date. Any visa issues arising from
                late delegate changes will be the full responsibility of the respective MC.
              </List.Item>
            </List>
    
            <Title order={3} className={styles.subsubtitle}>
              1.6. Visa Application Issues:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                Delegates registered in the 1st, 2nd, and 3rd rounds by May 31st, 2025, who have not obtained their visa and
                have not informed the CC about their cancellation will be fully liable for the conference fee.
              </List.Item>
              <List.Item className={styles.listItem}>
                Delegates who cannot attend the conference due to visa rejection or non-reply on their application and
                inform the CC between June 1st and June 10th, 2025, will be charged no more than 50% of the delegation fees.
              </List.Item>
              <List.Item className={styles.listItem}>
                <Text component="span" className={styles.strong}>
                  Exception:
                </Text>{" "}
                If the CC does not respond to the delegate within 3 business days after receiving the visa-related
                information, or if there is clear proof of gross negligence from the CC causing the delegate to not receive
                their visa on time, the delegate will not be liable for any cancellation fees.
              </List.Item>
            </List>
    
            <Title order={2} className={styles.subtitle}>
              2. Merchandise Cancellation and Refund Policy:
            </Title>
    
            <Title order={3} className={styles.subsubtitle}>
              2.1. Pre-order Payment:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                For pre-order-only merchandise items, a non-refundable upfront payment of 50% of the total price is required
                at the time of order.
              </List.Item>
              <List.Item className={styles.listItem}>
                For other pre-order merchandise items, a non-refundable upfront payment of 30% of the total price is
                required at the time of order.
              </List.Item>
            </List>
    
            <Title order={3} className={styles.subsubtitle}>
              2.2. Cancellation Period:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                Delegates can cancel their merchandise pre-orders free of charge until May 15th, 2025.
              </List.Item>
              <List.Item className={styles.listItem}>
                To initiate a merchandise cancellation, please follow the instructions provided on the merchandise ordering
                platform.
              </List.Item>
            </List>
    
            <Title order={3} className={styles.subsubtitle}>
              2.3. Non-refundable, Non-returnable, and Non-interchangeable After May 15th, 2025:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                After May 15th, 2025, all merchandise pre-orders are non-refundable, non-returnable, and
                non-interchangeable. This means that once the cancellation period has passed, you cannot request a refund,
                return the item, or exchange it for a different merchandise item.
              </List.Item>
              <List.Item className={styles.listItem}>
                Cancellations made after this date will incur the full cost of the pre-ordered merchandise.
              </List.Item>
            </List>
    
            <Title order={3} className={styles.subsubtitle}>
              2.4. Merchandise Collection:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                Pre-ordered merchandise items will only be available for collection by registered delegates during the
                conference days.
              </List.Item>
              <List.Item className={styles.listItem}>
                No shipping will be arranged for merchandise items that are not collected by delegates who are unable to
                attend the conference (no-shows). In such cases, the paid amount will not be refunded.
              </List.Item>
            </List>
    
            <Title order={2} className={styles.subtitle}>
              3. How to Request a Cancellation and Refund (if applicable):
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                Instructions on how to request a cancellation and any applicable refund will be provided on the official
                AIESEC International Congress 2025 website and registration platform. Please refer to those resources for
                detailed steps.
              </List.Item>
            </List>
    
            <Title order={2} className={styles.subtitle}>
              4. Contact Information:
            </Title>
            <List className={styles.list}>
              <List.Item className={styles.listItem}>
                For any questions or clarifications regarding this cancellation and refund policy, please contact the
                Congress Committee at{" "}
                <Anchor href="mailto:ic-2025-cc@aiesec.net" className={styles.link}>
                  ic-2025-cc@aiesec.net
                </Anchor>
              </List.Item>
            </List>
    
            <Text className={styles.warning}>
              Note: This cancellation and refund policy is subject to the terms and conditions outlined in the contract for
              AIESEC International Congress 2025. In case of any discrepancies, the contract terms will prevail.
            </Text>
          </Stack>
        </Container>
      )
}
