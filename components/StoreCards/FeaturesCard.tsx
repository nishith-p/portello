"use client";

import { Card, Image, Text, Group, Badge, Center, Button } from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons-react";
import classes from "./FeaturesCard.module.css";

interface Product {
  name: string;
  description: string;
  discount: number;
  price: number;
}

interface FeaturesCardProps {
  product: Product;
}

const mockdata = [
  { label: "4 passengers", icon: IconUsers },
  { label: "100 km/h in 4 seconds", icon: IconGauge },
  { label: "Automatic gearbox", icon: IconManualGearbox },
  { label: "Electric", icon: IconGasStation },
];

export default function FeaturesCard({ product }: FeaturesCardProps) {
  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image src="https://www.motortrend.com/files/6722a1e0334df100089b6261/bruce-wayne-x-batman-tumbler-7.jpg?w=768&width=768&q=75&format=webp" alt={product.name} />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{product.name}</Text>
          <Text fz="xs" c="dimmed">
            {product.description}
          </Text>
        </div>
        <Badge variant="outline">{product.discount}% off</Badge>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Basic configuration
        </Text>

        <Group gap={8} mb={-8}>
          {features}
        </Group>
      </Card.Section>

      <Card.Section className={`${classes.section} ${classes.priceSection}`}>
        <Group gap={30}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              ${product.price}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              per day
            </Text>
          </div>

          <Button radius="xl" style={{ flex: 1 }}>
            Add to Cart
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
