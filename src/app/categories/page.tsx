import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { CategoryBadge } from "@/components/content/CategoryBadge";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all 10 OWASP LLM vulnerability categories.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-foreground">
          <span className="text-primary">// </span>OWASP LLM Top 10
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ten vulnerability categories for Large Language Model applications — 2025 edition.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className={`group flex flex-col gap-3 rounded-lg border p-5 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${cat.bgColor} ${cat.borderColor}`}
          >
            <div className="flex items-center gap-2">
              <CategoryBadge category={cat.id} size="md" />
            </div>
            <div>
              <h2 className="mb-1 font-mono text-sm font-semibold text-foreground">
                {cat.name}
              </h2>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
