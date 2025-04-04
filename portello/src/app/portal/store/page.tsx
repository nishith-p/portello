'use client';

import { useState } from 'react';
import { Container, SimpleGrid, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCart } from '@/context';
import { ProductCard, ProductModal } from '@/components/ui';
import { items } from './data';
import { Item, CartItem } from '@/types/store';

export default function Page(): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { addToCart } = useCart();

  const handleViewProduct = (item: Item): void => {
    setSelectedItem(item);
    open();
  };

  const handleAddToCart = (size?: string, color?: { name: string; hex: string }): void => {
    if (!selectedItem) {
      return;
    }

    // Create a new CartItem
    const newItem: CartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      // Use the first image from the images array if available
      image: selectedItem.images?.length > 0 ? selectedItem.images[0] : undefined,
      // Include the selected size and color
      size: size,
      color: color?.name,
      colorHex: color?.hex,
      quantity: 1,
    };

    // Add to cart using context function
    addToCart(newItem);

    // Close modal
    close();
  };

  return (
    <Container fluid p="md">
      <Title order={2} c="gray.8" mb="xl">
        Store
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} onViewProduct={handleViewProduct} />
        ))}
      </SimpleGrid>

      <ProductModal
        opened={opened}
        onClose={close}
        selectedItem={selectedItem}
        onAddToCart={handleAddToCart}
      />
    </Container>
  );
}