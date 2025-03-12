"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Title,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Divider,
  Notification,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import type { Product } from "../types";
import { addProduct } from "../utils/productService";

const categories = [
  { value: "tshirt", label: "T-Shirts" },
  { value: "hoodie", label: "Hoodies" },
  { value: "hat", label: "Hats & Caps" },
  { value: "accessory", label: "Accessories" },
  { value: "poster", label: "Posters" },
];

const sizes = [
  { value: "xs", label: "xs" },
  { value: "s", label: "s" },
  { value: "m", label: "m" },
  { value: "l", label: "l" },
  { value: "xl", label: "xl" },
];

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      size: "",
      category: "",
      image: "",
      popularity: 4.0,
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Product name must be at least 3 characters" : null,
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters" : null,
      price: (value) => (value <= 0 ? "Price must be greater than 0" : null),
    //   size: (value) => (!value ? "Please select a category" : null),
      category: (value) => (!value ? "Please select a category" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);

    try {
      const newProduct: Omit<Product, "id" | "createdAt"> = {
        name: values.name,
        description: values.description,
        price: values.price,
        size: values.size,
        image: values.image || "https://placehold.co/600x400?text=Product",
        category: values.category,
        popularity: values.popularity,
      };

      await addProduct(newProduct);

      setNotification({
        show: true,
        message: "Product added successfully!",
        type: "success",
      });

      // Reset form
      form.reset();

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error);
      setNotification({
        show: true,
        message: "Error adding product. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="md" py="xl">
      {notification.show && (
        <Notification
          title={notification.type === "success" ? "Success" : "Error"}
          color={notification.type === "success" ? "green" : "red"}
          icon={
            notification.type === "success" ? (
              <IconCheck size={18} />
            ) : (
              <IconX size={18} />
            )
          }
          onClose={() => setNotification({ ...notification, show: false })}
          mb="md"
        >
          {notification.message}
        </Notification>
      )}

      <Paper shadow="xs" p="md" withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>Add New Product</Title>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.push("/store")}
            >
              Back to Store
            </Button>
          </Group>

          <Divider />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                required
                label="Product Name"
                placeholder="Enter product name"
                {...form.getInputProps("name")}
              />

              <Textarea
                required
                label="Description"
                placeholder="Enter product description"
                minRows={3}
                {...form.getInputProps("description")}
              />

              <Group grow>
                <NumberInput
                  required
                  label="Price ($)"
                  placeholder="0.00"
                  decimalScale={2}
                  min={0}
                  step={0.01}
                  {...form.getInputProps("price")}
                />

                <Select
                  label="Size"
                  placeholder="Select a size"
                  data={sizes}
                  {...form.getInputProps("size")}
                />

                <NumberInput
                  label="Popularity Rating"
                //   description="Product rating from 1-5"
                  placeholder="4.0"
                  decimalScale={1}
                  max={5}
                  step={0.1}
                  {...form.getInputProps("popularity")}
                />
              </Group>

              <Select
                required
                label="Category"
                placeholder="Select a category"
                data={categories}
                {...form.getInputProps("category")}
              />

              <TextInput
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                description="Enter a URL for the product image"
                {...form.getInputProps("image")}
              />

              <Text size="xs" color="dimmed">
                Note: In a production environment, you would have an image
                upload feature here.
              </Text>

              <Group justify="right" mt="md">
                <Button
                  type="submit"
                  leftSection={<IconDeviceFloppy size={16} />}
                  loading={isSubmitting}
                >
                  Save Product
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
