import { categories } from "@/components/store/data";

export function ShopByCategory() {
  return (
    <section className="bg-muted py-16 md:py-20">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">Shop by Category</h2>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.name}
              className="group rounded-xl bg-white dark:bg-zinc-900 border border-border p-5 md:p-8 flex flex-col items-center text-center hover:shadow-soft transition-shadow"
            >
              <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center text-xs tracking-widest text-zinc-500 dark:text-zinc-400">
                {category.icon}
              </div>
              <h3 className="mt-4 text-sm font-medium">{category.name}</h3>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-accent transition-colors">
                Explore collection
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
