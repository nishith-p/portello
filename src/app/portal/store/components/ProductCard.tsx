"use client"

import type React from "react"

import { useState } from "react"
import { Card, Image, Text, Badge, Button, Group, ActionIcon, Flex, Overlay, Box, rem } from "@mantine/core";
import { IconHeart, IconShoppingCart, IconEye, IconHeartFilled } from "@tabler/icons-react";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setWishlist(!wishlist)
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card.Section pos="relative">
        <Image src={product.image || "/placeholder.svg"} height={220} alt={product.name} />

        {hovered && (
          <Overlay opacity={0.2} color="#000" zIndex={1}>
            <Flex justify="center" align="center" h="100%" gap="md">
              <ActionIcon
                variant="filled"
                radius="xl"
                size="lg"
                color={wishlist ? "red" : "gray"}
                onClick={handleToggleWishlist}
              >
                {wishlist ? (
                  <IconHeartFilled style={{ width: rem(18), height: rem(18) }} />
                ) : (
                  <IconHeart style={{ width: rem(18), height: rem(18) }} />
                )}
              </ActionIcon>

              <ActionIcon variant="filled" radius="xl" size="lg" onClick={handleAddToCart}>
                <IconShoppingCart style={{ width: rem(18), height: rem(18) }} />
              </ActionIcon>

              <ActionIcon variant="filled" radius="xl" size="lg">
                <IconEye style={{ width: rem(18), height: rem(18) }} />
              </ActionIcon>
            </Flex>
          </Overlay>
        )}
      </Card.Section>

      <Box mt="md" mb="xs">
        <Badge color="blue" variant="light">
          {product.category}
        </Badge>
      </Box>

      <Text fw={500} size="lg" mb={5} lineClamp={1}>
        {product.name}
      </Text>

      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {product.description}
      </Text>

      <Group justify="space-between" mt="auto">
        <Text fw={700} size="xl">
          ${product.price.toFixed(2)}
        </Text>
        <Button variant="light" color="blue" onClick={handleAddToCart}>
          Add to cart
        </Button>
      </Group>
    </Card>
  )
}

