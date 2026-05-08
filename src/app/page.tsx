import { FeaturedProduct } from "@/components/store/featured-product";
import { HeroSlider } from "@/components/store/hero-slider";
import { ProductGrid } from "@/components/store/product-grid";
import { ShopByCategory } from "@/components/store/shop-by-category";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { getProducts } from "@/lib/store-api";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSlider />
        <ShopByCategory />
        <ProductGrid products={products} />
        <FeaturedProduct products={products} />
      </main>
      <SiteFooter />
    </div>
  );
}
