"use client"

import { Stack, Title, RangeSlider, Text, Checkbox, Radio, Group, Divider, Box } from "@mantine/core";

interface FilterSidebarProps {
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  sortOption: string
  setSortOption: (option: string) => void
}

const categories = [
  { value: "tshirt", label: "T-Shirts" },
  { value: "hoodie", label: "Hoodies" },
  { value: "hat", label: "Hats & Caps" },
  { value: "accessory", label: "Accessories" },
  { value: "poster", label: "Posters" },
]

export default function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  sortOption,
  setSortOption,
}: FilterSidebarProps) {
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <Stack gap="xl">
      <Box>
        <Title order={4} mb="md">
          Sort By
        </Title>
        <Radio.Group value={sortOption} onChange={setSortOption} name="sortOption">
          <Stack gap="xs">
            <Radio value="newest" label="Newest" />
            <Radio value="popularity" label="Popularity" />
            <Radio value="price-low" label="Price: Low to High" />
            <Radio value="price-high" label="Price: High to Low" />
          </Stack>
        </Radio.Group>
      </Box>

      <Divider />

      <Box>
        <Title order={4} mb="md">
          Price Range
        </Title>
        <RangeSlider
          value={priceRange}
          onChange={setPriceRange}
          min={0}
          max={200}
          step={5}
          minRange={10}
          label={(value) => `$${value}`}
          mb="xs"
        />
        <Group justify="space-between">
          <Text size="sm">${priceRange[0]}</Text>
          <Text size="sm">${priceRange[1]}</Text>
        </Group>
      </Box>

      <Divider />

      <Box>
        <Title order={4} mb="md">
          Categories
        </Title>
        <Checkbox.Group value={selectedCategories} onChange={setSelectedCategories}>
          <Stack gap="xs">
            {categories.map((category) => (
              <Checkbox
                key={category.value}
                value={category.value}
                label={category.label}
                onChange={() => handleCategoryChange(category.value)}
              />
            ))}
          </Stack>
        </Checkbox.Group>
      </Box>
    </Stack>
  )
}

