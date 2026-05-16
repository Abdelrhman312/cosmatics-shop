"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { searchSuggestions } from "@/components/store/data";
import { useCart } from "@/components/store/cart-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

export function SiteHeader() {
  const { resolvedTheme } = useTheme();
  const { items, totalAmount, totalItems, removeFromCart } = useCart();
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const suggestions = useMemo(() => {
    if (!search) return searchSuggestions;
    return searchSuggestions.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-40"
    >
      <div className="h-8 bg-accent text-white text-xs tracking-wide flex items-center justify-center">
         FREE SHIPPING Above 500 EGPs
      </div>
      <motion.div
        animate={{
          backgroundColor:
            resolvedTheme === "dark"
              ? isScrolled
                ? "rgba(24,24,27,0.97)"
                : "rgba(24,24,27,0.78)"
              : isScrolled
                ? "rgba(255,255,255,0.97)"
                : "rgba(255,255,255,0.7)",
          borderBottomColor:
            resolvedTheme === "dark"
              ? isScrolled
                ? "rgba(39,39,42,1)"
                : "rgba(63,63,70,0)"
              : isScrolled
                ? "rgba(229,231,235,1)"
                : "rgba(229,231,235,0)",
          backdropFilter: "blur(10px)",
        }}
        className="border-b"
      >
        <div className="container h-20 flex items-center justify-between gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="max-w-xs">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4 text-sm">
                  <Link href="/">New In</Link>
                  <Link href="/">Skincare</Link>
                  <Link href="/">Makeup</Link>
                  <Link href="/">Offers</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-700 dark:text-zinc-100 md:flex">
            <Link href="/">New In</Link>
            <Link href="/">Skincare</Link>
            <Link href="/">Makeup</Link>
            <Link href="/">Offers</Link>
          </nav>

          <Link href="/" className="text-lg font-semibold tracking-[0.22em] uppercase">
          Nevin Pharmacy
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open search">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Search Products</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Input
                    placeholder="Search by product or concern"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <ul className="space-y-3 text-sm">
                    {suggestions.map((item) => (
                      <li
                        key={item}
                        className="cursor-pointer text-zinc-600 hover:text-accent dark:text-zinc-100"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <AnimatePresence>
                    {totalItems > 0 ? (
                      <motion.span
                        key={totalItems}
                        initial={{ scale: 0.45, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.45, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 24 }}
                        className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white dark:ring-zinc-900"
                      >
                        {totalItems > 99 ? "99+" : totalItems}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Cart ({totalItems})</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                      <span>Free shipping progress</span>
                      <span>{Math.min(totalAmount, 500)} / 500 EGP</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.min((totalAmount / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {items.length === 0 ? (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Your cart is empty.</p>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-500 hover:text-accent dark:text-zinc-400"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Items: {totalItems}</span>
                    <span>Total: {totalAmount.toFixed(2)} EGP</span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
