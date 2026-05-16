"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Product } from "@/types/store";

export function SuggestedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">No suggestions available right now.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <motion.article
          key={product.id}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-xl border border-border bg-white dark:border-zinc-800 dark:bg-zinc-900"
        >
          <Link href={`/product/${product.id}`} className="relative block aspect-[4/5]">
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          </Link>
          <div className="p-4">
            <h3 className="font-medium">{product.name}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{product.price} EGP</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
