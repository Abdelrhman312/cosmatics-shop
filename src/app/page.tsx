import { FeaturedProduct } from "@/components/store/featured-product";
import { HeroSlider } from "@/components/store/hero-slider";
import { ProductGrid } from "@/components/store/product-grid";
import { ShopByCategory } from "@/components/store/shop-by-category";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSlider />
        <ShopByCategory />
        <ProductGrid />
        <FeaturedProduct />
      </main>
      <SiteFooter />
    </div>
  );
}
