"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/store";

export function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart();
  // Temporarily disable the filter UI without deleting its implementation.
  const showFilters = false;
  const [skinFilters, setSkinFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSkin =
        skinFilters.length === 0 || skinFilters.includes(String(product.skin_type));
      const matchCategory =
        categoryFilters.length === 0 || categoryFilters.includes(product.category);
      return matchSkin && matchCategory;
    });
  }, [products, skinFilters, categoryFilters]);

  const uniqueCategories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="py-16 md:py-24"
    >
      <div className="container">
        {showFilters ? (
        <aside className="h-fit rounded-xl border border-border bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-28">
          <h3 className="font-semibold">Filter Products</h3>
          <div className="mt-6 space-y-5 text-sm">
            <FilterGroup
              title="Skin Type"
              options={["Dry", "Oily", "Combination", "Sensitive", "All"]}
              selected={skinFilters}
              onChange={setSkinFilters}
            />
            <FilterGroup
              title="Collection"
              options={uniqueCategories}
              selected={categoryFilters}
              onChange={setCategoryFilters}
            />
            <FilterGroup title="Price" options={["$0 - $30", "$30 - $60", "$60+"]} />
          </div>
        </aside>
        ) : null}

        <div>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Best Sellers</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{filteredProducts.length} products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-xl border border-border bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-[4/5]">
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="w-full" onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{product.price} EGP</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function FilterGroup({
  title,
  options,
  selected = [],
  onChange,
}: {
  title: string;
  options: string[];
  selected?: string[];
  onChange?: (values: string[]) => void;
}) {
  const toggleOption = (option: string) => {
    if (!onChange) return;
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
      return;
    }
    onChange([...selected, option]);
  };

  return (
    <div>
      <h4 className="font-medium">{title}</h4>
      <div className="mt-3 space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-100">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
