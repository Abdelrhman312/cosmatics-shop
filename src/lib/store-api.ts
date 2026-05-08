import { fallbackProducts } from "@/lib/fallback-data";
import { getSupabaseClient, hasSupabaseEnv } from "@/lib/supabase";
import { Product } from "@/types/store";

export async function getProducts(): Promise<Product[]> {
  if (!hasSupabaseEnv) return fallbackProducts;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,category,skin_type,image_url,created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return fallbackProducts;
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => String(product.id) === id) ?? null;
}

export async function getSuggestedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category === product.category || item.skin_type === product.skin_type)
    )
    .slice(0, limit);
}
