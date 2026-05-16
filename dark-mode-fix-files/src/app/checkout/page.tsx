import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";

import { CheckoutClient } from "./checkout-client";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-[#0a0a0a] dark:text-zinc-100">
      <SiteHeader />
      <main>
        <CheckoutClient />
      </main>
      <SiteFooter />
    </div>
  );
}
