import { getCategoryMeta } from "@/lib/categories";
import type { OwaspCategory } from "@/types/owasp";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: OwaspCategory;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const meta = getCategoryMeta(category);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded border font-mono font-semibold",
        meta.bgColor,
        meta.textColor,
        meta.borderColor,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
      )}
      title={meta.name}
    >
      {meta.code}
    </span>
  );
}
