import Link from "next/link";
import type { LucideProps } from "lucide-react";
import {
  Terminal,
  Eye,
  Package,
  Biohazard,
  Code2,
  Bot,
  FileKey,
  Database,
  AlertTriangle,
  Zap,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { CategoryMeta } from "@/lib/categories";

// Map icon string names to Lucide components
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Terminal,
  Eye,
  Package,
  Biohazard,
  Code2,
  Bot,
  FileKey,
  Database,
  AlertTriangle,
  Zap,
};

function CategoryCard({ category }: { category: CategoryMeta }) {
  const Icon = ICON_MAP[category.icon] ?? Terminal;

  return (
    <Link
      href={`/categories/${category.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border p-4 transition-all",
        "hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        category.bgColor,
        category.borderColor
      )}
      aria-label={`${category.code}: ${category.name}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn("font-mono text-xs font-bold", category.textColor)}
          >
            {category.code}
          </span>
          <Icon
            className={cn("size-4", category.textColor)}
            aria-hidden
          />
        </div>
        <ArrowRight
          className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>

      <div>
        <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">
          {category.name}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {category.description}
        </p>
      </div>
    </Link>
  );
}

export function CategoryGrid() {
  return (
    <section className="px-4 py-12 sm:px-6" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-baseline justify-between">
          <h2
            id="categories-heading"
            className="font-mono text-lg font-semibold text-foreground"
          >
            <span className="text-primary">// </span>10 Risk Categories
          </h2>
          <Link
            href="/categories"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
