'use client';

import { useEffect, useState } from 'react';
import { IconShirt, IconShoppingCart } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Button,
  Center,
  CloseButton,
  ColorSwatch,
  Divider,
  Flex,
  Grid,
  Image,
  Modal,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { StoreItem } from '@/lib/store/types';
import classes from './product-modal.module.css';

interface ProductModalProps {
  opened: boolean;
  onCloseAction: () => void;
  selectedItem: StoreItem | null;
  onAddToCartAction: (size?: string, color?: { name: string; hex: string }) => void;
}

export function ProductModal({
  opened,
  onCloseAction,
  selectedItem,
  onAddToCartAction,
}: ProductModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Reset selections when a create item is selected
  useEffect(() => {
    if (selectedItem) {
      setActiveImageIndex(0);
      setSelectedSize(selectedItem.sizes.length > 0 ? selectedItem.sizes[0] : null);
      setSelectedColorHex(selectedItem.colors.length > 0 ? selectedItem.colors[0].hex : null);
      setImageErrors({}); // Reset image errors when item changes
    }
  }, [selectedItem]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));

    // If the currently active image fails, try to find another valid image
    if (index === activeImageIndex && selectedItem?.images.length) {
      const nextValidIndex = selectedItem.images.findIndex(
        (_, idx) => !imageErrors[idx] && idx !== index
      );
      if (nextValidIndex !== -1) {
        setActiveImageIndex(nextValidIndex);
      }
    }
  };

  const isAddToCartDisabled = (): boolean => {
    if (!selectedItem) {
      return true;
    }

    // If product has sizes but none selected
    if (selectedItem.sizes.length > 0 && !selectedSize) {
      return true;
    }

    // If product has colors but none selected
    return selectedItem.colors.length > 0 && !selectedColorHex;
  };

  // Get the full color object for the selected color hex
  const getSelectedColorObject = () => {
    if (!selectedItem || !selectedColorHex) {
      return undefined;
    }
    return selectedItem.colors.find((color) => color.hex === selectedColorHex);
  };

  // Handle add to cart with selected options
  const handleAddToCart = () => {
    onAddToCartAction(
      selectedSize || undefined,
      selectedColorHex ? getSelectedColorObject() : undefined
    );
  };

  // Check if any valid images exist
  const hasValidImages = selectedItem?.images.length
    ? selectedItem.images.some((_, index) => !imageErrors[index])
    : false;

  // Render thumbnails
  const renderThumbnails = () => {
    if (!selectedItem || selectedItem.images.length <= 1) {
      return null;
    }

    // Filter out images with errors
    const validImages = selectedItem.images.filter((_, index) => !imageErrors[index]);

    if (validImages.length <= 1) {
      return null;
    }

    return (
      <div className={classes.thumbnailsContainer}>
        <div className={classes.thumbnailsWrapper}>
          {selectedItem.images.map((image, index) => {
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
                  alt={`${selectedItem.name} view ${index + 1}`}
                />
              </Box>
            );
          })}
        </div>
      </div>
    );
  };

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
      {selectedItem && (
        <Box pos="relative">
          {/* Custom close button in the top right corner */}
          <CloseButton onClick={onCloseAction} className={classes.closeButton} size="lg" />

          <Grid gutter={0} className={classes.modalGrid}>
            {/* Product Images - Left Side */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              {/* Fixed-size image container */}
              <div className={classes.imageContainer}>
                {hasValidImages ? (
                  <div className={classes.imageWrapper}>
                    <Image
                      src={selectedItem.images[activeImageIndex]}
                      className={classes.productImage}
                      onError={() => handleImageError(activeImageIndex)}
                      alt={selectedItem.name}
                    />
                  </div>
                ) : (
                  <Center h="100%" w="100%" className={classes.imagePlaceholder}>
                    <IconShirt size={80} color="gray" />
                  </Center>
                )}

                {/* Thumbnails at the bottom of the image */}
                {renderThumbnails()}
              </div>
            </Grid.Col>

            {/* Product Details - Right Side */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              p="md"
              className={`${classes.productDetails} ${classes.productDetailsColumn}`}
            >
              <Stack gap="md" h="100%">
                {/* Name at the top */}
                <Text size="xl" fw={700} mb={0}>
                  {selectedItem.name}
                </Text>

                {/* Price just under the name */}
                {selectedItem.pre_price !== 0 && selectedItem.discount_perc !== 0 ? (
                  <Flex gap={10} align="center">
                    <Badge variant="light" color="gray" size="lg" w="fit-content">
                      <Text fw={700} td="line-through">
                        ${selectedItem.pre_price?.toFixed(2)}
                      </Text>
                    </Badge>
                    <Text c="red">-{selectedItem.discount_perc}%</Text>
                    <Badge color="green" size="lg" variant="filled" w="fit-content">
                      ${selectedItem.price.toFixed(2)}
                    </Badge>
                  </Flex>
                ) : (
                  <Badge color="gray" size="lg" variant="filled" w="fit-content">
                    ${selectedItem.price.toFixed(2)}
                  </Badge>
                )}

                {/* Product ID */}
                <Text size="sm" c="dimmed">
                  Product ID: {selectedItem.item_code}
                </Text>

                {/* Description */}
                <Text>{selectedItem.description}</Text>

                <Divider />

                {/* Size Selection */}
                {selectedItem.sizes.length > 0 && (
                  <Box>
                    <Text fw={600} size="sm" mb="xs">
                      Size
                    </Text>
                    {selectedItem.sizes.length === 1 ? (
                      <Text>{selectedItem.sizes[0]}</Text>
                    ) : (
                      <Select
                        placeholder="Select a size"
                        data={selectedItem.sizes.map((size) => ({ value: size, label: size }))}
                        value={selectedSize}
                        onChange={setSelectedSize}
                        required
                        radius="md"
                      />
                    )}
                  </Box>
                )}

                {/* Color Selection */}
                {selectedItem.colors.length > 0 && (
                  <Box>
                    <Text fw={600} size="sm" mb="xs">
                      Color
                    </Text>
                    <Flex gap="md" wrap="wrap">
                      {selectedItem.colors.map((color) => (
                        <Stack key={color.hex} align="center" gap="xs">
                          <ColorSwatch
                            color={color.hex}
                            size={36}
                            radius="xl"
                            className={
                              selectedColorHex === color.hex
                                ? classes.colorSwatchActive
                                : classes.colorSwatch
                            }
                            onClick={() => setSelectedColorHex(color.hex)}
                          />
                          <Text size="xs">{color.name}</Text>
                        </Stack>
                      ))}
                    </Flex>
                  </Box>
                )}

                {/* Push button to bottom */}
                <div style={{ flexGrow: 1 }} />

                <Button
                  size="lg"
                  leftSection={<IconShoppingCart size={20} />}
                  disabled={isAddToCartDisabled()}
                  onClick={handleAddToCart}
                  radius="md"
                  color="blue"
                  fullWidth
                >
                  Add to Cart
                </Button>
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>
      )}
    </Modal>
  );
}
