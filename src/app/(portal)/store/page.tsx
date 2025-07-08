'use client';

import { useState } from 'react';
import { IconAlertCircle, IconPackages } from '@tabler/icons-react';
import {
  Alert,
  Box,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ProductCard, ProductModal } from '@/app/(portal)/store/(components)';
import { PackCard } from '@/app/(portal)/store/(components)/pack-card';
import { PackModal } from '@/app/(portal)/store/(components)/pack-modal';
import { useCart } from '@/context/cart';
import { useStoreItems, useStoreItemsSeparated } from '@/lib/store/items/hooks';
import { useStorePacks } from '@/lib/store/packs/hooks';
import { StoreItem, StorePack } from '@/lib/store/types';
import { DiscountBanner } from './(components)/discount-banner';

export default function StorePage() {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [selectedPack, setSelectedPack] = useState<StorePack | null>(null);

  const [itemModalOpened, { open: openItemModal, close: closeItemModal }] = useDisclosure(false);
  const [packModalOpened, { open: openPackModal, close: closePackModal }] = useDisclosure(false);

  const { addToCart } = useCart();
  
  // Existing hooks
  const { data: itemsData, isLoading: isLoadingItems, error: itemsError } = useStoreItems();
  const { data: packsData, isLoading: isLoadingPacks, error: packsError } = useStorePacks();
  
  // New hook for consumables
  const { data: separatedData } = useStoreItemsSeparated();

  const handleViewProduct = (item: StoreItem) => {
    setSelectedItem(item);
    openItemModal();
  };

  const handleViewPack = (pack: StorePack) => {
    setSelectedPack(pack);
    openPackModal();
  };

  const handleAddToCart = (size?: string, color?: { name: string; hex: string }) => {
    if (!selectedItem) {
      return;
    }

    addToCart({
      id: selectedItem.id,
      item_code: selectedItem.item_code,
      name: selectedItem.name,
      price: selectedItem.price,
      pre_price: selectedItem.pre_price || 0,
      discount_perc: selectedItem.discount_perc || 0,
      image: selectedItem.images?.[0],
      size,
      color: color?.name,
      colorHex: color?.hex,
      quantity: 1,
    });

    closeItemModal();
  };

  // Original items data (filter out consumables)
  const allItems = itemsData?.items || [];
  const consumables = separatedData?.consumables || [];
  const nonConsumableItems = allItems.filter(item => 
    !consumables.some(consumable => consumable.id === item.id)
  );
  
  const packs = packsData?.packs || [];

  const hasConsumables = consumables.length > 0;
  const hasNonConsumables = nonConsumableItems.length > 0;
  const hasPacks = packs.length > 0;

  if (isLoadingItems || isLoadingPacks) {
    return (
      <Container fluid p="md">
        <Title size="h2" mb="xl" c="gray.8">
          Store
        </Title>
        <Center mt="xl">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (itemsError || packsError) {
    return (
      <Container fluid p="md">
        <Title size="h2" mb="xl" c="gray.8">
          Store
        </Title>
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          <Text>Failed to load store items. Please try again later.</Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid p="md">
      <Title size="h2" mb="xl" c="gray.8">
        Store
      </Title>

      {hasConsumables || hasNonConsumables || hasPacks ? (
        <>
          {/* Consumables Section */}
          {hasConsumables && (
            <Box mb={hasNonConsumables || hasPacks ? "xl" : undefined}>
              <Title size="h3" mb="md">
                Consumables
              </Title>
              <SimpleGrid cols={{ sm: 2, md: 4 }} spacing="lg">
                {consumables.map((item) => (
                  <ProductCard key={item.id} item={item} onViewProductAction={handleViewProduct} />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {hasConsumables && (hasNonConsumables || hasPacks) && <Divider my="xl" />}

          {/* Packs Section */}
          {hasPacks && (
            <Box mb={hasNonConsumables ? "xl" : undefined}>
              <Group align="center" mb="md">
                <Group gap="xs" align="center">
                  <IconPackages size={24} />
                  <Title size="h3">Packs</Title>
                </Group>
                {hasNonConsumables && (
                  <Text size="sm" c="dimmed">
                    Get more for less with our bundled packs
                  </Text>
                )}
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                {packs.map((pack) => (
                  <PackCard key={pack.id} pack={pack} onViewPackAction={handleViewPack} />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {hasPacks && hasNonConsumables && <Divider my="xl" />}

          {/* Individual Products Section (non-consumables only) */}
          {hasNonConsumables && (
            <Box>
              {hasPacks && (
                <Title size="h3" mb="md">
                  Individual Products
                </Title>
              )}

              <SimpleGrid cols={{ sm: 2, md: 4 }} spacing="lg">
                {nonConsumableItems.map((item) => (
                  <ProductCard key={item.id} item={item} onViewProductAction={handleViewProduct} />
                ))}
              </SimpleGrid>
            </Box>
          )}
        </>
      ) : (
        <Center mt="xl">
          <Alert icon={<IconAlertCircle size={16} />} title="No Items" color="blue">
            <Text>There are no items available in the store right now.</Text>
          </Alert>
        </Center>
      )}

      {/* Modals */}
      <ProductModal
        opened={itemModalOpened}
        onCloseAction={closeItemModal}
        selectedItem={selectedItem}
        onAddToCartAction={handleAddToCart}
      />

      <PackModal
        opened={packModalOpened}
        onCloseAction={closePackModal}
        selectedPack={selectedPack}
      />
    </Container>
  );
}
