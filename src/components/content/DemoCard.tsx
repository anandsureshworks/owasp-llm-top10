import Link from "next/link";
import { KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/content/CategoryBadge";
import { cn } from "@/lib/utils";
import type { OwaspCategory } from "@/types/owasp";

export type DemoType =
  | "interactive"
  | "visualization"
  | "comparison"
  | "benchmark";

export interface DemoCardProps {
  title: string;
  description: string;
  slug: string;
  owaspCategory: OwaspCategory;
  demoType: DemoType;
  isSafeToRun: boolean;
  requiresApiKey: boolean;
}

const DEMO_TYPE_LABELS: Record<DemoType, string> = {
  interactive: "Interactive",
  visualization: "Visualization",
  comparison: "Comparison",
  benchmark: "Benchmark",
};

export function DemoCard({
  title,
  description,
  slug,
  owaspCategory,
  demoType,
  isSafeToRun,
  requiresApiKey,
}: DemoCardProps) {
  return (
    <Card className="flex flex-col gap-0 py-0 transition-colors hover:border-primary/40">
      <CardHeader className="gap-3 px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <CategoryBadge category={owaspCategory} size="sm" />
          <Badge
            variant="outline"
            className="rounded font-mono text-[10px] text-muted-foreground"
          >
            {DEMO_TYPE_LABELS[demoType]}
          </Badge>
          <div className="ml-auto flex items-center gap-1.5">
            <span
              className={cn(
                "size-2 rounded-full shrink-0",
                isSafeToRun ? "bg-green-500" : "bg-yellow-500"
              )}
              title={isSafeToRun ? "Safe to run" : "Use with caution"}
              aria-label={isSafeToRun ? "Safe to run" : "Use with caution"}
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              {isSafeToRun ? "Safe" : "Caution"}
            </span>
          </div>
        </div>
        <CardTitle className="text-sm leading-snug">
          <Link
            href={`/${slug}`}
            className="text-foreground transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-3">
        <CardDescription className="line-clamp-2 text-xs leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>

      {requiresApiKey && (
        <CardFooter className="px-5 pb-5">
          <Badge
            variant="outline"
            className="flex items-center gap-1 rounded border-yellow-300 dark:border-yellow-800/50 bg-yellow-100/70 dark:bg-yellow-950/30 font-mono text-[10px] text-yellow-700 dark:text-yellow-400"
          >
            <KeyRound className="size-2.5" aria-hidden="true" />
            API key required
          </Badge>
        </CardFooter>
      )}
    </Card>
  );
}
