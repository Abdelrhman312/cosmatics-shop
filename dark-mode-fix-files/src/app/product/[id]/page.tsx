import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { SuggestedProducts } from "@/components/store/suggested-products";
import { getProductById, getSuggestedProducts } from "@/lib/store-api";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const suggested = await getSuggestedProducts(product, 6);

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-[#0a0a0a] dark:text-zinc-100">
      <SiteHeader />
      <main>
        <section className="py-16 md:py-24">
          <div className="container grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border dark:border-zinc-800">
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            </div>
            <div className="rounded-xl border border-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
              <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">{product.category}</p>
              <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
              <p className="mt-4 text-zinc-600 dark:text-zinc-100">{product.description}</p>
              <p className="mt-6 text-2xl font-semibold">{product.price} EGP</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Skin Type: {product.skin_type}</p>
              <Link
                href="/checkout"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium text-white transition-colors hover:bg-[#285f5a]"
              >
                Go to Checkout
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-semibold">Suggested for you</h2>
            <SuggestedProducts products={suggested} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
