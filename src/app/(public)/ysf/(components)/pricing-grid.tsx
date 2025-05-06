import { Container, Title, Text } from "@mantine/core";
import { PricingCard } from "./pricing-card";
import styles from "./pricing-grid.module.css";
import { PricingGridProps, PricingPlan } from "@/lib/ysf/types";

export function PricingGrid({ title, description, plans, onSelect }: PricingGridProps) {
  return (
    <Container className={styles.wrapper} size="lg">
      {title && (
        <Title className={styles.title} order={2}>
          {title}
        </Title>
      )}

      {description && (
        <Text c="dimmed" className={styles.description} size="lg">
          {description}
        </Text>
      )}

      <div className={styles.grid}>
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} onClick={() => onSelect?.(plan)} />
        ))}
      </div>
    </Container>
  );
}
