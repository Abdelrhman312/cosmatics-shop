"use client";

import { motion } from "framer-motion";

import { categories } from "@/components/store/data";

export function ShopByCategory() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-muted py-16 dark:bg-zinc-950 md:py-20"
    >
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">Shop by Category</h2>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <motion.article
              key={category.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="group flex flex-col items-center rounded-xl border border-border bg-white p-5 text-center transition-shadow hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-900 md:p-8"
            >
              <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center text-xs tracking-widest text-zinc-500 dark:text-zinc-400">
                {category.icon}
              </div>
              <h3 className="mt-4 text-sm font-medium">{category.name}</h3>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-accent transition-colors">
                Explore collection
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
