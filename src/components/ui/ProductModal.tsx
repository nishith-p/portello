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
import { Item } from '@/types/store';
import classes from './ProductModal.module.css';

interface ProductModalProps {
  opened: boolean;
  onClose: () => void;
  selectedItem: Item | null;
  onAddToCart: (size?: string, color?: { name: string; hex: string }) => void;
}

export function ProductModal({ opened, onClose, selectedItem, onAddToCart }: ProductModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(null);

  // Reset selections when a new item is selected
  useEffect(() => {
    if (selectedItem) {
      setActiveImageIndex(0);
      setSelectedSize(selectedItem.sizes.length > 0 ? selectedItem.sizes[0] : null);
      setSelectedColorHex(selectedItem.colors.length > 0 ? selectedItem.colors[0].hex : null);
    }
  }, [selectedItem]);

  const isAddToCartDisabled = (): boolean => {
    if (!selectedItem) {
      return true;
    }

    // If product has sizes but none selected
    if (selectedItem.sizes.length > 0 && !selectedSize) {
      return true;
    }

    // If product has colors but none selected
    if (selectedItem.colors.length > 0 && !selectedColorHex) {
      return true;
    }

    return false;
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
    onAddToCart(selectedSize || undefined, selectedColorHex ? getSelectedColorObject() : undefined);
  };

  // Render thumbnails
  const renderThumbnails = () => {
    if (!selectedItem || selectedItem.images.length <= 1) {
      return null;
    }

    return (
      <div className={classes.thumbnailsContainer}>
        <div className={classes.thumbnailsWrapper}>
          {selectedItem.images.map((image, index) => (
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
                alt={`${selectedItem.name} view ${index + 1}`}
              />
            </Box>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
          <CloseButton onClick={onClose} className={classes.closeButton} size="lg" />

          <Grid gutter={0} className={classes.modalGrid}>
            {/* Product Images - Left Side */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              {/* Fixed-size image container */}
              <div className={classes.imageContainer}>
                {selectedItem.images.length > 0 ? (
                  <div className={classes.imageWrapper}>
                    <Image
                      src={selectedItem.images[activeImageIndex]}
                      className={classes.productImage}
                      alt={selectedItem.name}
                    />
                  </div>
                ) : (
                  <Center h="100%" w="100%">
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
                <Badge color="blue" size="lg" variant="filled" w="fit-content">
                  ${selectedItem.price.toFixed(2)}
                </Badge>

                {/* Product ID */}
                <Text size="sm" c="dimmed">
                  Product ID: {selectedItem.id}
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