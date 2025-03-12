"use client"

import { SimpleGrid, Pagination, Center, Box } from "@mantine/core";
import ProductCard from "./ProductCard";
import type { Product } from "../types";

interface ProductGridProps {
  products: Product[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function ProductGrid({ products, currentPage, totalPages, onPageChange }: ProductGridProps) {
  return (
    <Box>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 4 }}
        spacing="lg"
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        mb="xl"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Center my="xl">
          <Pagination total={totalPages} value={currentPage} onChange={onPageChange} withEdges />
        </Center>
      )}
    </Box>
  )
}

