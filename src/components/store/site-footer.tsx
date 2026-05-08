import { Search, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white dark:bg-zinc-950">
      <div className="container py-14 grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold tracking-[0.2em] uppercase">EVA CLINICAL</h3>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
            Results-driven skincare inspired by modern dermatological science.
          </p>
        </div>

        <div>
          <h4 className="font-medium">Newsletter</h4>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Get launch drops, skincare tips, and private offers.</p>
          <div className="mt-4 flex gap-2">
            <Input placeholder="Your email address" />
            <Button>Join</Button>
          </div>
        </div>

        <div>
          <h4 className="font-medium">Follow</h4>
          <div className="mt-4 flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
            <User className="h-5 w-5" />
            <Search className="h-5 w-5" />
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
