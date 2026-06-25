import Link from "next/link";
import { Calendar } from "lucide-react";
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
import { formatDate } from "@/lib/utils";
import type { OwaspCategory, Difficulty, Severity } from "@/types/owasp";

export interface WriteupCardProps {
  title: string;
  description: string;
  slug: string;
  owaspCategory: OwaspCategory;
  difficulty: Difficulty;
  severity: Severity;
  publishedAt: string;
  tags: string[];
}

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  beginner: "bg-green-100/70 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800/50",
  intermediate: "bg-yellow-100/70 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800/50",
  advanced: "bg-red-100/70 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800/50",
};

const SEVERITY_CLASSES: Record<Severity, string> = {
  low: "bg-blue-100/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800/50",
  medium: "bg-yellow-100/70 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800/50",
  high: "bg-orange-100/70 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-800/50",
  critical: "bg-red-100/70 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800/50",
};

export function WriteupCard({
  title,
  description,
  slug,
  owaspCategory,
  difficulty,
  severity,
  publishedAt,
  tags,
}: WriteupCardProps) {
  return (
    <Card className="flex flex-col gap-0 py-0 transition-colors hover:border-primary/40">
      <CardHeader className="gap-3 px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <CategoryBadge category={owaspCategory} size="sm" />
          <span
            className={`inline-flex shrink-0 items-center rounded border font-mono px-1.5 py-0.5 text-[10px] font-medium capitalize ${DIFFICULTY_CLASSES[difficulty]}`}
          >
            {difficulty}
          </span>
          <span
            className={`inline-flex shrink-0 items-center rounded border font-mono px-1.5 py-0.5 text-[10px] font-medium uppercase ${SEVERITY_CLASSES[severity]}`}
          >
            {severity}
          </span>
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

      <CardFooter className="flex-col items-start gap-3 px-5 pb-5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded px-1.5 py-0 font-mono text-[10px] text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="size-3" aria-hidden="true" />
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </div>
      </CardFooter>
    </Card>
  );
}
