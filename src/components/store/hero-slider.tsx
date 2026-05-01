"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { heroSlides } from "@/components/store/data";

export function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[active];

  return (
    <section className="relative min-h-[72vh] w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt={slide.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-10 flex min-h-[72vh] items-center">
        <div className="max-w-xl text-white">
          <p className="mb-3 text-sm uppercase tracking-[0.2em]">Performance Beauty</p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">{slide.title}</h1>
          <p className="mt-5 text-base md:text-lg text-white/85">{slide.subtitle}</p>
          <Button className="mt-8" size="lg">
            {slide.cta}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActive(idx)}
            className={`h-2 rounded-full transition-all ${idx === active ? "w-8 bg-white" : "w-2 bg-white/60"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
