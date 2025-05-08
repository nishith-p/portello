'use client';

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from 'react';
import { IconPackages, IconShoppingCart } from '@tabler/icons-react';
import {
  Accordion,
  Badge,
  Box,
  Button,
  Center,
  CloseButton,
  ColorSwatch,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  createCartPackItem,
  removeSelectedOptionalItem,
  selectOptionalItem,
  updateCartPackItemDetail,
} from '@/components/cart-drawer/utils';
import { useCart } from '@/context/cart';
import { CartPackItem, CartPackItemDetail, StorePack } from '@/lib/store/types';
import classes from './pack-modal.module.css';

interface PackModalProps {
  opened: boolean;
  onCloseAction: () => void;
  selectedPack: StorePack | null;
}

export function PackModal({ opened, onCloseAction, selectedPack }: PackModalProps) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [cartPackItem, setCartPackItem] = useState<any>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  // Separate regular and optional items
  const regularItems = selectedPack?.pack_items?.filter((item) => !item.is_optional) || [];
  const optionalItems = selectedPack?.pack_items?.filter((item) => item.is_optional) || [];

  // Calculate totals
  const totalRegularItems = regularItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalOptionalItems = optionalItems.reduce((sum, item) => sum + item.quantity, 0);

  // Reset selections when a new pack is selected
  useEffect(() => {
    if (selectedPack) {
      setActiveImageIndex(0);
      setImageErrors({}); // Reset image errors when pack changes

      // Initialize the cart pack item with default selections
      try {
        if (selectedPack.pack_items && selectedPack.pack_items.length > 0) {
          const initialCartPackItem = createCartPackItem(selectedPack);
          setCartPackItem(initialCartPackItem);
        }
      } catch (err) {
        console.error('Failed to initialize pack options:', err);
      }
    }
  }, [selectedPack]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));

    // If the currently active image fails, try to find another valid image
    if (index === activeImageIndex && selectedPack?.images.length) {
      const nextValidIndex = selectedPack.images.findIndex(
        (_, idx) => !imageErrors[idx] && idx !== index
      );
      if (nextValidIndex !== -1) {
        setActiveImageIndex(nextValidIndex);
      }
    }
  };

  // Handle size selection for a pack item
  const handleSizeChange = (itemIndex: number, size: string) => {
    if (!cartPackItem) {
      return;
    }

    const updatedItem = updateCartPackItemDetail(cartPackItem, itemIndex, { size });
    setCartPackItem(updatedItem);
  };

  // Handle color selection for a pack item
  const handleColorChange = (itemIndex: number, colorInfo: { name: string; hex: string }) => {
    if (!cartPackItem) {
      return;
    }

    const updatedItem = updateCartPackItemDetail(cartPackItem, itemIndex, {
      color: colorInfo.name,
      colorHex: colorInfo.hex,
    });

    setCartPackItem(updatedItem);
  };

  // Check if all required selections have been made
  const isAddToCartDisabled = (): boolean => {
    if (!cartPackItem || !selectedPack) {
      return true;
    }

    // Check if there are optional items but none is selected
    const hasOptionalItems = selectedPack.pack_items?.some((item) => item.is_optional);
    const noOptionalSelected = hasOptionalItems && !cartPackItem.selected_optional_item;

    if (noOptionalSelected) {
      return true;
    }

    // Check required selections for regular items
    for (let i = 0; i < cartPackItem.pack_items.length; i++) {
      const packItemDetail = cartPackItem.pack_items[i];
      const originalItem = selectedPack.pack_items?.find(
        (pi) => pi.item && pi.item.id === packItemDetail.item_id
      )?.item;

      if (!originalItem) continue;

      // Skip validation for optional items
      const isOptional = selectedPack.pack_items?.find(
        (pi) => pi.item_id === packItemDetail.item_id
      )?.is_optional;

      if (isOptional) continue;

      // If item has sizes but none selected
      if (originalItem.sizes && originalItem.sizes.length > 0 && !packItemDetail.size) {
        return true;
      }

      // If item has colors but none selected
      if (originalItem.colors && originalItem.colors.length > 0 && !packItemDetail.color) {
        return true;
      }
    }

    return false;
  };

  // Add a helper function to show validation messages
  const showValidationMessage = () => {
    if (!cartPackItem?.selected_optional_item && optionalItems.length > 0) {
      notifications.show({
        title: 'Selection Required',
        message: 'Please select one option from the optional items',
        color: 'yellow',
      });
    }
  };

  // Add the pack to cart
  const handleAddToCart = () => {
    if (isAddToCartDisabled() || !cartPackItem || !selectedPack) {
      return;
    }

    setIsAddingToCart(true);

    try {
      // Add the pack to cart
      addToCart(cartPackItem);

      // Show success notification
      notifications.show({
        title: 'Added to Cart',
        message: `${selectedPack.name} has been added to your cart`,
        color: 'green',
      });

      // Close the modal
      onCloseAction();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add pack to cart',
        color: 'red',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Check if any valid images exist
  const hasValidImages = selectedPack?.images.length
    ? selectedPack.images.some((_, index) => !imageErrors[index])
    : false;

  // Render thumbnails
  const renderThumbnails = () => {
    if (!selectedPack || selectedPack.images.length <= 1) {
      return null;
    }

    // Filter out images with errors
    const validImages = selectedPack.images.filter((_, index) => !imageErrors[index]);

    if (validImages.length <= 1) {
      return null;
    }

    return (
      <div className={classes.thumbnailsContainer}>
        <div className={classes.thumbnailsWrapper}>
          {selectedPack.images.map((image, index) => {
            // Skip thumbnails for images that failed to load
            if (imageErrors[index]) {
              return null;
            }

            return (
              <Box
                key={index}
                className={index === activeImageIndex ? classes.thumbnailActive : classes.thumbnail}
                onClick={() => setActiveImageIndex(index)}
              >
                <Image
                  src={image}
                  h={60}
                  w={60}
                  fit="cover"
                  onError={() => handleImageError(index)}
                  alt={`${selectedPack.name} view ${index + 1}`}
                />
              </Box>
            );
          })}
        </div>
      </div>
    );
  };

  // Calculate total items in the pack
  const totalItems = selectedPack?.pack_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Modal
      opened={opened}
      onClose={onCloseAction}
      padding={0}
      radius="md"
      centered
      lockScroll
      withCloseButton={false}
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
      shadow="xl"
      classNames={{
        content: classes.modal,
      }}
      size="auto"
    >
      {selectedPack && cartPackItem && (
        <Box pos="relative">
          {/* Custom close button in the top right corner */}
          <CloseButton onClick={onCloseAction} className={classes.closeButton} size="lg" />

          <Grid gutter={0} className={classes.modalGrid}>
            {/* Pack Images - Left Side */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              {/* Fixed-size image container */}
              <div className={classes.imageContainer}>
                {hasValidImages ? (
                  <div className={classes.imageWrapper}>
                    <Image
                      src={selectedPack.images[activeImageIndex]}
                      className={classes.productImage}
                      onError={() => handleImageError(activeImageIndex)}
                      alt={selectedPack.name}
                    />
                  </div>
                ) : (
                  <Center h="100%" w="100%" className={classes.imagePlaceholder}>
                    <IconPackages size={80} color="gray" />
                  </Center>
                )}

                {/* Thumbnails at the bottom of the image */}
                {renderThumbnails()}
              </div>
            </Grid.Col>

            {/* Pack Details - Right Side */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              p="md"
              className={`${classes.productDetails} ${classes.productDetailsColumn}`}
            >
              <Stack gap="md" h="100%" style={{ position: 'relative' }}>
                <Box style={{ overflowY: 'auto', paddingRight: '8px', height: '100%' }}>
                  {/* Pack type badge */}
                  <Badge color="blue" size="lg" variant="filled" w="fit-content">
                    Bundle Pack
                  </Badge>

                  {/* Name at the top */}
                  <Text size="xl" fw={700} mb={0} mt="xs">
                    {selectedPack.name}
                  </Text>

                  {selectedPack.pre_price !== 0 && selectedPack.discount_perc !== 0 ? (
                    <Flex gap={10} align="center" mt="xs">
                      <Badge variant="light" color="gray" size="lg" w="fit-content">
                        <Text fw={700} td="line-through">
                          €{selectedPack.pre_price?.toFixed(2)}
                        </Text>
                      </Badge>
                      <Text c="red">-{selectedPack.discount_perc}%</Text>
                      <Badge color="green" size="lg" variant="filled" w="fit-content">
                        €{selectedPack.price.toFixed(2)}
                      </Badge>
                    </Flex>
                  ) : (
                    <Badge color="gray" size="lg" variant="filled" w="fit-content" mt="xs">
                      €{selectedPack.price.toFixed(2)}
                    </Badge>
                  )}

                  {/* Pack ID */}
                  <Text size="sm" c="dimmed" mt="xs">
                    Pack ID: {selectedPack.pack_code}
                  </Text>

                  {/* Description */}
                  <Text mt="md">{selectedPack.description}</Text>

                  <Divider label="What's Included" labelPosition="center" mt="lg" mb="md" />

                  {/* Pack Items Summary */}
                  <Paper withBorder p="md" radius="md">
                    <Text fw={700} mb="xs">
                      This pack contains {totalItems} item{totalItems !== 1 ? 's' : ''}:
                    </Text>

                    <Stack gap="xs">
                      {/* Regular Items */}
                      {regularItems.map((packItem) => (
                        <Group key={packItem.id} justify="space-between">
                          <Group gap="xs">
                            <Badge size="sm" variant="filled" radius="sm">
                              {packItem.quantity}×
                            </Badge>
                            <Text>{packItem.item?.name || 'Unknown Item'}</Text>
                          </Group>
                          <Text size="sm" fw={500}>
                            €{packItem.item?.price.toFixed(2)}
                          </Text>
                        </Group>
                      ))}

                      {/* Optional Items - only show if they exist */}
                      {optionalItems.length > 0 && (
                        <>
                          <Divider my="sm" label="Optional Items" labelPosition="center" />
                          {optionalItems.map((packItem) => (
                            <Group key={packItem.id} justify="space-between">
                              <Group gap="xs">
                                <Badge size="sm" variant="outline" color="green" radius="sm">
                                  {packItem.quantity}×
                                </Badge>
                                <Text>{packItem.item?.name || 'Unknown Item'}</Text>
                              </Group>
                              <Text size="sm" fw={500} c="dimmed">
                                €{packItem.item?.price.toFixed(2)}
                              </Text>
                            </Group>
                          ))}
                          <Text size="sm" c="dimmed" mt="xs">
                            * Choose one from the optional items below
                          </Text>
                        </>
                      )}
                    </Stack>

                    <Divider my="md" />

                    <Group justify="space-between">
                      <Text fw={700}>Bundle Price:</Text>
                      <Text fw={700} size="lg">
                        €{selectedPack.price.toFixed(2)}
                      </Text>
                    </Group>
                  </Paper>

                  <Divider label="Customize Items" labelPosition="center" mt="lg" mb="md" />

                  {/* Item Customization Section */}
                  <Accordion variant="separated">
                    {/* Regular Items */}
                    {cartPackItem.pack_items.map((packItem: CartPackItemDetail, index: number) => {
                      const originalItem = selectedPack.pack_items?.find(
                        (pi) => pi.item && pi.item.id === packItem.item_id
                      )?.item;

                      if (!originalItem) return null;

                      return (
                        <Accordion.Item
                          key={`regular-${packItem.item_id}`}
                          value={`regular-${packItem.item_id}`}
                        >
                          <Accordion.Control>
                            <Group>
                              <Text fw={600}>{packItem.name}</Text>
                              <Badge>{packItem.quantity}x</Badge>
                            </Group>
                          </Accordion.Control>
                          <Accordion.Panel>
                            <Stack gap="md">
                              {/* Size Selection */}
                              {originalItem.sizes && originalItem.sizes.length > 0 && (
                                <Box>
                                  <Text fw={600} size="sm" mb="xs">
                                    Size
                                  </Text>
                                  {originalItem.sizes.length === 1 ? (
                                    <Text>{originalItem.sizes[0]}</Text>
                                  ) : (
                                    <Select
                                      placeholder="Select a size"
                                      data={originalItem.sizes.map((size: string) => ({
                                        value: size,
                                        label: size,
                                      }))}
                                      value={packItem.size || null}
                                      onChange={(value) => handleSizeChange(index, value || '')}
                                      required
                                      radius="md"
                                    />
                                  )}
                                </Box>
                              )}

                              {/* Color Selection */}
                              {originalItem.colors && originalItem.colors.length > 0 && (
                                <Box>
                                  <Text fw={600} size="sm" mb="xs">
                                    Color
                                  </Text>
                                  <Flex gap="md" wrap="wrap">
                                    {originalItem.colors.map(
                                      (color: { name: string; hex: string }) => (
                                        <Stack key={color.hex} align="center" gap="xs">
                                          <ColorSwatch
                                            color={color.hex}
                                            size={36}
                                            radius="xl"
                                            className={
                                              packItem.colorHex === color.hex
                                                ? classes.colorSwatchActive
                                                : classes.colorSwatch
                                            }
                                            onClick={() => handleColorChange(index, color)}
                                          />
                                          <Text size="xs">{color.name}</Text>
                                        </Stack>
                                      )
                                    )}
                                  </Flex>
                                </Box>
                              )}
                            </Stack>
                          </Accordion.Panel>
                        </Accordion.Item>
                      );
                    })}

                    {/* Optional Items Section */}
                    {cartPackItem.optional_items.length > 0 && (
                      <Accordion.Item key="optional-items" value="optional-items">
                        <Accordion.Control>
                          <Group>
                            <Text fw={600}>Optional Items</Text>
                            <Badge color="teal" variant="light">
                              Choose 1
                            </Badge>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Text size="sm" c="dimmed">
                              Select one option from the following items:
                            </Text>

                            {cartPackItem.optional_items.map(
                              (optionalItem: CartPackItemDetail, index: number) => {
                                const originalItem = selectedPack.pack_items?.find(
                                  (pi) => pi.item && pi.item.id === optionalItem.item_id
                                )?.item;

                                if (!originalItem) return null;

                                const isSelected =
                                  cartPackItem.selected_optional_item?.item_id ===
                                  optionalItem.item_id;
                                const itemIndex = cartPackItem.pack_items.length + index; // Adjust index for handler functions

                                return (
                                  <Paper
                                    key={optionalItem.item_id}
                                    withBorder
                                    p="md"
                                    radius="md"
                                    style={{
                                      borderColor: isSelected
                                        ? 'var(--mantine-color-teal-6)'
                                        : undefined,
                                      backgroundColor: isSelected
                                        ? 'var(--mantine-color-teal-0)'
                                        : undefined,
                                    }}
                                  >
                                    <Group justify="space-between" mb="sm">
                                      <Text fw={600}>{optionalItem.name}</Text>
                                      <Badge
                                        color={isSelected ? 'teal' : 'gray'}
                                        variant={isSelected ? 'filled' : 'light'}
                                      >
                                        {optionalItem.quantity}x
                                      </Badge>
                                    </Group>

                                    <Stack gap="md">
                                      {/* Size Selection */}
                                      {originalItem.sizes && originalItem.sizes.length > 0 && (
                                        <Box>
                                          <Text fw={500} size="sm" mb="xs">
                                            Size
                                          </Text>
                                          {originalItem.sizes.length === 1 ? (
                                            <Text>{originalItem.sizes[0]}</Text>
                                          ) : (
                                            <Select
                                              placeholder="Select a size"
                                              data={originalItem.sizes.map((size: string) => ({
                                                value: size,
                                                label: size,
                                              }))}
                                              value={optionalItem.size || null}
                                              onChange={(value) =>
                                                handleSizeChange(itemIndex, value || '')
                                              }
                                              radius="md"
                                              disabled={!isSelected}
                                            />
                                          )}
                                        </Box>
                                      )}

                                      {/* Color Selection */}
                                      {originalItem.colors && originalItem.colors.length > 0 && (
                                        <Box>
                                          <Text fw={500} size="sm" mb="xs">
                                            Color
                                          </Text>
                                          <Flex gap="md" wrap="wrap">
                                            {originalItem.colors.map(
                                              (color: { name: string; hex: string }) => (
                                                <Stack key={color.hex} align="center" gap="xs">
                                                  <ColorSwatch
                                                    color={color.hex}
                                                    size={28}
                                                    radius="xl"
                                                    className={
                                                      optionalItem.colorHex === color.hex
                                                        ? classes.colorSwatchActive
                                                        : classes.colorSwatch
                                                    }
                                                    onClick={() =>
                                                      isSelected &&
                                                      handleColorChange(itemIndex, color)
                                                    }
                                                    style={{
                                                      opacity: isSelected ? 1 : 0.6,
                                                      cursor: isSelected ? 'pointer' : 'default',
                                                    }}
                                                  />
                                                  <Text size="xs">{color.name}</Text>
                                                </Stack>
                                              )
                                            )}
                                          </Flex>
                                        </Box>
                                      )}

                                      <Button
                                        fullWidth
                                        variant={isSelected ? 'filled' : 'outline'}
                                        color="teal"
                                        onClick={() => {
                                          if (isSelected) {
                                            // Update the cart pack item to remove the selection
                                            // You'll need to implement this function
                                            setCartPackItem(
                                              removeSelectedOptionalItem(cartPackItem)
                                            );
                                          } else {
                                            // First update any size/color selections
                                            const updatedItem = {
                                              ...optionalItem,
                                              // Include any default selections if none are made
                                              size:
                                                optionalItem.size ||
                                                originalItem.sizes?.[0] ||
                                                undefined,
                                              color:
                                                optionalItem.color ||
                                                originalItem.colors?.[0]?.name ||
                                                undefined,
                                              colorHex:
                                                optionalItem.colorHex ||
                                                originalItem.colors?.[0]?.hex ||
                                                undefined,
                                            };

                                            // Then select this optional item
                                            setCartPackItem(
                                              selectOptionalItem(cartPackItem, index)
                                            );
                                          }
                                        }}
                                      >
                                        {isSelected ? 'Selected ✓' : 'Select This Option'}
                                      </Button>
                                    </Stack>
                                  </Paper>
                                );
                              }
                            )}
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    )}
                  </Accordion>
                </Box>

                {/* Add to Cart Button - Fixed at the bottom */}
                <Box
                  mt="auto"
                  pt="md"
                  style={{
                    position: 'sticky',
                    bottom: 0,
                    background: 'var(--mantine-color-gray-0)',
                    zIndex: 2,
                  }}
                >
                  <Button
                    size="lg"
                    leftSection={<IconShoppingCart size={20} />}
                    onClick={() => {
                      if (isAddToCartDisabled()) {
                        showValidationMessage();
                      } else {
                        handleAddToCart();
                      }
                    }}
                    radius="md"
                    color="blue"
                    fullWidth
                    disabled={isAddingToCart}
                    loading={isAddingToCart}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>
      )}
    </Modal>
  );
}
