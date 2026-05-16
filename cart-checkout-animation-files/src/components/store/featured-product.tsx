"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/store";

export function FeaturedProduct({ products }: { products: Product[] }) {
  const { addToCart } = useCart();
  const featured = products[0];
  if (!featured) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-muted py-16 dark:bg-zinc-950 md:py-24"
    >
      <div className="container grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`relative ${index === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}
            >
              <Image src={item.image_url} alt={item.name} fill className="rounded-xl object-cover" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-xl border border-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 md:p-8"
        >
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">Featured Formula</p>
          <h2 className="mt-2 text-3xl font-semibold">{featured.name}</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-100">{featured.description}</p>
          <p className="mt-6 text-xl font-semibold">{featured.price} EGP</p>
          <Button className="mt-6 w-full md:w-auto" onClick={() => addToCart(featured)}>
            Add to Cart
          </Button>

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="ingredients">
              <AccordionTrigger>Ingredients</AccordionTrigger>
              <AccordionContent>
                Bakuchiol, squalane, peptides, hyaluronic acid, and botanical antioxidants.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-to-use">
              <AccordionTrigger>How to Use</AccordionTrigger>
              <AccordionContent>
                Apply two pumps on clean skin at night, followed by moisturizer. Use SPF in the morning.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>

      <div className="container mt-12">
        <h3 className="text-2xl font-semibold">Related Products</h3>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={product.id}
              className="min-w-[220px] rounded-xl border border-border bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Link href={`/product/${product.id}`} className="relative block aspect-square">
                <Image src={product.image_url} alt={product.name} fill className="rounded-lg object-cover" />
              </Link>
              <h4 className="mt-3 text-sm font-medium">{product.name}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{product.price} EGP</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
