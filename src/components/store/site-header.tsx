"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";

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

export function SiteHeader() {
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
    <header className="sticky top-0 z-40">
      <div className="h-8 bg-accent text-white text-xs tracking-wide flex items-center justify-center">
         FREE SHIPPING Above 500 EGPs
      </div>
      <motion.div
        animate={{
          backgroundColor: isScrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.7)",
          borderBottomColor: isScrolled ? "rgba(229,231,235,1)" : "rgba(229,231,235,0)",
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

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-700">
            <Link href="/">New In</Link>
            <Link href="/">Skincare</Link>
            <Link href="/">Makeup</Link>
            <Link href="/">Offers</Link>
          </nav>

          <Link href="/" className="text-lg font-semibold tracking-[0.22em] uppercase">
          Nevin Pharmacy
          </Link>

          <div className="flex items-center gap-2">
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
                      <li key={item} className="text-zinc-600 hover:text-accent cursor-pointer">
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
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Cart (2)</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                      <span>Free shipping progress</span>
                      <span>$68 / $90</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100">
                      <div className="h-full w-3/4 rounded-full bg-accent" />
                    </div>
                  </div>
                  <Button className="w-full">Checkout</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
