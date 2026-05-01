"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { products } from "@/components/store/data";
import { Button } from "@/components/ui/button";

export function ProductGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="container grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-28 h-fit rounded-xl border border-border p-5">
          <h3 className="font-semibold">Filter Products</h3>
          <div className="mt-6 space-y-5 text-sm">
            <FilterGroup title="Skin Type" options={["Dry", "Oily", "Combination", "Sensitive"]} />
            <FilterGroup title="Collection" options={["Essentials", "Vitamin C", "Retinol"]} />
            <FilterGroup title="Price" options={["$0 - $30", "$30 - $60", "$60+"]} />
          </div>
        </aside>

        <div>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Best Sellers</h2>
            <p className="text-sm text-zinc-500">24 products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.article
                key={product.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-white"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="w-full">Quick Add</Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600">{product.price}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div>
      <h4 className="font-medium">{title}</h4>
      <div className="mt-3 space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-zinc-600">
            <input type="checkbox" className="h-4 w-4 rounded border-border accent-accent" />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
