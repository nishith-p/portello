import type { Product } from "../types";
import { supabaseClient } from './supabaseClient';

export async function addProduct(product: Omit<Product, "id" | "createdAt">) {
  const { data, error } = await supabaseClient
    .from("merch_item")
    .insert([
      {
        merch_name: product.name,
        merch_description: product.description,
        merch_price: product.price,
        merch_size: product.size,
        merch_category: product.category,
        merch_picture: product.image,
        merch_popularity: product.popularity
      },
    ]);

  if (error) throw error;
  return data;
}

export async function fetchProduct(productId: string) {
  if (!productId) return;
  const { data, error } = await supabaseClient
    .from("merch_item")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(productId: string, updatedProduct: Partial<Omit<Product, "id" | "createdAt">>) {
  if (!productId) return;

  const { data, error } = await supabaseClient
    .from("merch_item")
    .update({
      merch_name: updatedProduct.name,
      merch_description: updatedProduct.description,
      merch_price: updatedProduct.price,
      merch_size: updatedProduct.size,
      merch_category: updatedProduct.category,
      merch_picture: updatedProduct.image,
      merch_popularity: updatedProduct.popularity,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
