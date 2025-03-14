"use client";

import { useState, useEffect } from "react";
import {
  AppShell,
  Container,
  Flex,
  Title,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Header from "./components/Header";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import type { Product } from "./types";
import { mockProducts } from "./data/mockProducts";
import { CartProvider } from "./hooks/useCart";
import { supabaseClient } from "./utils/supabaseClient";

export default function MerchStore() {
  const [opened, { toggle }] = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Simulate fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient.from("merch_item").select("*");
  
      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        console.log("Fetched Data:", data);
  
        const formattedData = data.map((item) => ({
          id: item.id,
          name: item.merch_name,
          description: item.merch_description,
          price: Number(item.merch_price),
          size: item.merch_size,
          category: item.merch_category,
          image: item.merch_picture || "/placeholder.svg",
          popularity: Number(item.merch_popularity) || 0,
          createdAt: item.created_at
        }));
  
        setProducts(formattedData);
        setFilteredProducts([...formattedData]);
      }
      setLoading(false);
    };
  
    fetchProducts();
  }, []);
  
  
  // Log the updated state after it changes
  useEffect(() => {
    console.log("Updated products state:", products);
  }, [products]);
  

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, priceRange, selectedCategories, sortOption, products]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAdmin = true;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <CartProvider>
        <AppShell.Header>
          <Header
            opened={opened}
            toggle={toggle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isAdmin={isAdmin}
          />
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <Container size="xl">
            <Flex direction="column" gap="md">
              <Title order={1} mb="md">
                Merchandise Store
              </Title>

              {loading ? (
                <Center h={400}>
                  <Loader size="xl" />
                </Center>
              ) : filteredProducts.length > 0 ? (
                <>
                  <Text c="dimmed">
                    Showing {filteredProducts.length} products
                  </Text>
                  <ProductGrid
                    products={currentProducts}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isAdmin={isAdmin}
                  />
                </>
              ) : (
                <Center h={200}>
                  <Text size="xl">
                    No products found matching your criteria
                  </Text>
                </Center>
              )}
            </Flex>
          </Container>
        </AppShell.Main>
      </CartProvider>
    </AppShell>
  );
}
