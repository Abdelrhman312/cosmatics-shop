"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { products } from "@/components/store/data";

export function FeaturedProduct() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((item, index) => (
            <div key={item.id} className={`relative ${index === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}>
              <Image src={item.image} alt={item.name} fill className="rounded-xl object-cover" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-white p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Featured Formula</p>
          <h2 className="mt-2 text-3xl font-semibold">Bio-Retinol Night Renewal</h2>
          <p className="mt-4 text-zinc-600">
            A gentle, high-performance treatment designed to smooth texture and support skin renewal.
          </p>
          <p className="mt-6 text-xl font-semibold">$58</p>
          <Button className="mt-6 w-full md:w-auto">Add to Cart</Button>

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
        </div>
      </div>

      <div className="container mt-12">
        <h3 className="text-2xl font-semibold">Related Products</h3>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={product.id}
              className="min-w-[220px] rounded-xl border border-border bg-white p-3"
            >
              <div className="relative aspect-square">
                <Image src={product.image} alt={product.name} fill className="rounded-lg object-cover" />
              </div>
              <h4 className="mt-3 text-sm font-medium">{product.name}</h4>
              <p className="text-sm text-zinc-500">{product.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
