import type { Product } from "../types";
import { supabaseClient } from "./supabaseClient";

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
