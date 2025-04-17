'use client';

import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, Center, Container, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ProductCard, ProductModal } from '@/app/portal/store/(components)';
import { useCart } from '@/context';
import { useStoreItems } from '@/lib/store/items/hooks';
import { StoreItem } from '@/lib/store/types';

export default function StorePage(): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { addToCart } = useCart();

  // Fetch store items from the API
  const { data, isLoading, error } = useStoreItems(); // Updated function call

  const handleViewProduct = (item: StoreItem): void => {
    setSelectedItem(item);
    open();
  };

  const handleAddToCart = (size?: string, color?: { name: string; hex: string }): void => {
    if (!selectedItem) {
      return;
    }

    // Create a new CartItem
    const newItem = {
      id: selectedItem.id,
      item_code: selectedItem.item_code,
      name: selectedItem.name,
      price: selectedItem.price,
      // Use the first image from the images array if available
      image: selectedItem.images?.length > 0 ? selectedItem.images[0] : undefined,
      // Include the selected size and color
      size,
      color: color?.name,
      colorHex: color?.hex,
      quantity: 1,
    };

    // Add to cart using context function
    addToCart(newItem);

    // Close modal
    close();
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container fluid p="md">
        <Title order={2} c="gray.8" mb="xl">
          Store
        </Title>
        <Center mt="xl">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container fluid p="md">
        <Title order={2} c="gray.8" mb="xl">
          Store
        </Title>
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          <Text>Failed to load store items. Please try again later.</Text>
        </Alert>
      </Container>
    );
  }

  // Check if we have items to display
  const items = data?.items || [];
  const hasItems = items.length > 0;

  return (
    <Container fluid p="md">
      <Title order={2} c="gray.8" mb="xl">
        Store
      </Title>

      {hasItems ? (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg">
          {items.map((item: StoreItem) => (
            <ProductCard key={item.id} item={item} onViewProductAction={handleViewProduct} />
          ))}
        </SimpleGrid>
      ) : (
        <Center mt="xl">
          <Alert icon={<IconAlertCircle size={16} />} title="No Items" color="blue">
            <Text>There are no items available in the store right now.</Text>
          </Alert>
        </Center>
      )}

      <ProductModal
        opened={opened}
        onClose={close}
        selectedItem={selectedItem}
        onAddToCart={handleAddToCart}
      />
    </Container>
  );
}
